package com.example.fragment.enity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.File;
import java.util.Date;

/**
 * @author flowerwine
 * @date 2024 年 03 月 25 日
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
public class FileInfo {
    /**
     * 分片数量
     */
    private Integer chunkCount;
    /**
     * 分片暂存目录
     */
    private File chunkTempDir;
    /**
     * 文件在客户端的名称
     */
    private String filenameFromClient;
    /**
     * 文件在服务端的名称
     */
    private String filenameFromServer;
    /**
     * 文件的后缀名
     */
    private String suffix;
    /**
     * 文件分片是否已上传, 数组索引为分片索引, 若为 true 表示已经上传
     */
    private boolean[] isChunkUploadedArr;
    /**
     * 最近一次上传文件的时间
     */
    private Date uploadTime;
    /**
     * 文件是否上传
     */
    private boolean isUpload;
}
