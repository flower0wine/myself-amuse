package com.example.fragment.enity;

/**
 * @author flowerwine
 * @date 2023 年 12 月 01 日
 */
public enum StatusCodeEnum {
    /**
     * 成功
     */
    SUCCESS(200),
    /**
     * 客户端错误
     */
    CLIENT_ERROR(400),
    /**
     * 服务端错误
     */
    SERVER_ERROR(500),
    ;

    private Integer code;

    StatusCodeEnum(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return this.code;
    }
}
