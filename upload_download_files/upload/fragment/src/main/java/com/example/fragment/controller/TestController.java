package com.example.fragment.controller;

import com.example.fragment.enity.FileInfo;
import com.example.fragment.enity.Result;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author flowerwine
 * @date 2023 年 11 月 29 日
 */
@RestController
@RequestMapping("/file")
public class TestController {
    private final String tempDir = "B:/chunk/";

    private final Map<String, FileInfo> fileInfoMap;

    public TestController() {
        fileInfoMap = new ConcurrentHashMap<>();
    }

    @GetMapping("/preupload")
    public Result<?> preUpload(String filename, Integer size) {
        final int chunkSize = 1 << 20;
        FileInfo fileInfo = getFileInfo(filename);

        if(Objects.isNull(fileInfo)) {
            fileInfo = new FileInfo();

            int dotIndex = filename.lastIndexOf(".");
            fileInfo.setFilenameFromClient(filename.substring(0, dotIndex));
            fileInfo.setSuffix(filename.substring(dotIndex));

            // 保存文件名
            fileInfo.setFilenameFromClient(filename);
            fileInfo.setFilenameFromServer(UUID.randomUUID().toString());

            int sum = 0;
            int length = 0;
            while (sum < size) {
                sum += chunkSize;
                length++;
            }
            // 保存分片数量
            fileInfo.setChunkCount(length);

            fileInfo.setIsChunkUploadedArr(new boolean[length]);

            // 创建分片上传的临时目录
            String chunkTempDir = String.format("%s%s%s", this.tempDir, "chunk_", System.currentTimeMillis());
            File file = createDirectory(chunkTempDir);
            fileInfo.setChunkTempDir(file);

            fileInfoMap.put(fileInfo.getFilenameFromServer(), fileInfo);
        }

        fileInfo.setUploadTime(new Date());

        // 查找已上传的分片索引
        List<Integer> list = new ArrayList<>();
        boolean[] isChunkUploadedArr = fileInfo.getIsChunkUploadedArr();

        for(int i = 0; i < isChunkUploadedArr.length; i++) {
            if(isChunkUploadedArr[i]) {
                list.add(i);
            }
        }

        Map<String, Object> map = new HashMap<>(8);
        map.put("size", chunkSize);
        map.put("filename", fileInfo.getFilenameFromServer());
        map.put("chunkIndex", list);
        return Result.ok(map);
    }

    @PostMapping("/uploading")
    public Result<?> upload(@RequestParam("file") MultipartFile file, Integer index, String filename) throws IOException {
        FileInfo fileInfo = getFileInfo(filename);

        // 如果提供的文件名对应的 FileInfo 查找不到, 或者该分片已经存在
        if(Objects.isNull(index) || Objects.isNull(fileInfo) || fileInfo.getIsChunkUploadedArr()[index]) {
            return Result.clientError();
        }

        // 创建分片文件
        String chunkPath = String.format("%s/%s", fileInfo.getChunkTempDir().getAbsolutePath(), index);
        File chunk = new File(chunkPath);
        chunk.createNewFile();
        file.transferTo(chunk);

        // 设置该分片状态为已上传
        fileInfo.getIsChunkUploadedArr()[index] = true;

        return Result.ok(null);
    }

    @GetMapping("/merge")
    public Result<?> uploaded(String filename) throws IOException {
        FileInfo fileInfo = getFileInfo(filename);

        if(Objects.isNull(fileInfo)) {
            return Result.clientError();
        } else {
            // 检查所有分片是否均上传完毕
            boolean[] isChunkUploadedArr = fileInfo.getIsChunkUploadedArr();
            for(boolean b : isChunkUploadedArr) {
                if(!b) {
                    return Result.clientError();
                }
            }
        }

        final int chunkSize = 1 << 20;

        // 拼接最终文件路径
        File resultFile = new File("B:/" + fileInfo.getFilenameFromServer() + fileInfo.getSuffix());
        RandomAccessFile writeFile = new RandomAccessFile((resultFile), "rw");
        RandomAccessFile readFile;
        byte[] bytes = new byte[chunkSize];

        File[] files = fileInfo.getChunkTempDir().listFiles();

        assert files != null;
        for (File file : files) {
            int pos = chunkSize * Integer.parseInt(file.getName());
            writeFile.seek(pos);
            readFile = new RandomAccessFile(file, "r");
            while (readFile.read(bytes) != -1) {
                writeFile.write(bytes);
            }
            readFile.close();
        }
        writeFile.close();

        // 删除分片和临时目录
        for (File file : files) {
            file.delete();
        }
        fileInfo.getChunkTempDir().delete();

        // 清除文件信息
        clearFileInfo(filename);

        return Result.ok(null);
    }

    @GetMapping("/cancel")
    public Result<?> cancel(String filename) {
        FileInfo fileInfo = getFileInfo(filename);

        if(Objects.isNull(fileInfo)) {
            return Result.clientError();
        }

        File[] files = fileInfo.getChunkTempDir().listFiles();
        assert files != null;
        for (File file : files) {
            file.delete();
        }

        // 清除文件信息
        clearFileInfo(filename);

        return Result.ok(null);
    }

    private FileInfo getFileInfo(String key) {
        return this.fileInfoMap.get(key);
    }

    private void clearFileInfo(String key) {
        this.fileInfoMap.remove(key);
    }

    private File createDirectory(String path) {
        File file = new File(path);
        if(!file.exists()) {
            file.mkdirs();
        }
        return file;
    }
}
