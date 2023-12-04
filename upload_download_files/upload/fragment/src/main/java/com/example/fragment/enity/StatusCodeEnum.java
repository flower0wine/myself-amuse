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
     * 错误
     */
    ERROR(500);

    private Integer code;

    StatusCodeEnum(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return this.code;
    }
}
