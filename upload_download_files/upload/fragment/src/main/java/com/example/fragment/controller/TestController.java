package com.example.fragment.controller;

import cn.hutool.crypto.SecureUtil;
import com.example.fragment.enity.FileHistory;
import com.example.fragment.enity.Result;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.EOFException;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * @author flowerwine
 * @date 2023 年 11 月 29 日
 */
@RestController
@RequestMapping("/file")
public class TestController {
    private int CHUNK_SIZE;
    /**
     * 分片的暂存目录
     */
    private File dir;
    /**
     * 文件在服务端的名称
     */
    private String resultFileName;
    /**
     * 文件的后缀名
     */
    private String suffix;
    /**
     * 文件分片的 hash
     */
    private String[] fileHash;
    /**
     * 分片数量
     */
    private Integer chunkNumber;
    /**
     * 上传历史
     */
    private Map<String, FileHistory> map;
    private final int bufferLength;

    public TestController() {
        this.CHUNK_SIZE = 1 << 20;
        this.bufferLength = 1 << 10;
        this.dir = new File("B:/chunk");
        map = new HashMap<>();
    }

    @PostMapping("/upload")
    public Result<?> upload(@RequestParam("file") MultipartFile file, Integer index, Integer size, String name) throws IOException {
        Result<?> result = this.checkFilename(name);
        if (!result.success()) {
            return Result.error();
        }
        // 判断当前索引对应的分片是否存在
        if (this.fileHash[index] != null) {
            return Result.error();
        }
        // 以索引作为分片名, 如索引为 1 则文件名为 1
        File chunk = new File(this.dir, index + "");
        chunk.createNewFile();
        // 获取该分片的文件 hash, 分片的 hash 可以做文件秒传
        String md5 = SecureUtil.md5(chunk);
        fileHash[index] = md5;

        file.transferTo(chunk);
        return Result.ok(null);
    }

    @GetMapping("/preupload")
    public Result<?> preUpload(String filename, Integer size, String name) {
        if (this.resultFileName == null) {
            // 生成文件名
            this.resultFileName = UUID.randomUUID().toString();
            int dotIndex = filename.lastIndexOf(".");
            this.suffix = filename.substring(dotIndex);
            int sum = 0;
            int length = 0;
            while (sum < size) {
                sum += CHUNK_SIZE;
                length++;
            }
            this.chunkNumber = length;
            this.fileHash = new String[length];
        }

        // 查找已经存在的分片索引
        AtomicInteger index = new AtomicInteger();
        List<Integer> collect = Arrays.stream(fileHash).filter(Objects::nonNull).map((item) -> index.getAndIncrement()).collect(Collectors.toList());

        Map<String, Object> map = new HashMap<>(8);
        map.put("size", this.CHUNK_SIZE);
        map.put("filename", this.resultFileName);
        map.put("chunkIndex", collect);
        return Result.ok(map);
    }

    @GetMapping("/uploaded")
    public Result<?> uploaded(String name) throws IOException {
        Result<?> result = this.checkFilename(name);
        if (!result.success()) {
            return Result.error();
        }
        File[] files = this.dir.listFiles();
        RandomAccessFile writeFile = new RandomAccessFile(new File("B:/" + this.resultFileName + this.suffix), "rw");
        RandomAccessFile readFile;
        byte[] bytes = new byte[this.bufferLength];
        for (File file : files) {
            int pos = this.CHUNK_SIZE * Integer.parseInt(file.getName());
            writeFile.seek(pos);
            readFile = new RandomAccessFile(file, "r");
            while (readFile.read(bytes) != -1) {
                writeFile.write(bytes);
            }
            readFile.close();
        }
        writeFile.close();
        for (File file : files) {
            file.delete();
        }
        this.reset();
        return Result.ok(null);
    }

    @GetMapping("/cancel")
    public Result<?> cancel(String name) {
        Result<?> result = this.checkFilename(name);
        if (!result.success()) {
            return result;
        }
        File[] files = this.dir.listFiles();
        for (File file : files) {
            file.delete();
        }
        this.reset();
        return Result.ok(null);
    }

    /**
     * 判断传入的文件名是否与当前处理的文件名相同 (不包含后缀)
     * @param name 文件名, 不包含后缀
     * @return 相同返回 true, 反之返回 false
     */
    private Result<?> checkFilename(String name) {
        if (this.resultFileName.equals(name)) {
            return Result.ok(null);
        }
        return Result.error();
    }

    /**
     * 重置, 可以重新上传
     */
    private void reset() {
        this.chunkNumber = 0;
        this.fileHash = null;
        this.resultFileName = null;
        this.suffix = null;
    }
}
