package com.example.fragment.enity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author flowerwine
 * @date 2023 年 11 月 29 日
 */
@Setter
@Getter
@ToString
@NoArgsConstructor
public class Result<T> {
    private String message;
    private Integer code;
    private T data;

    public Result(String message, Integer code, T data) {
        this.message = message;
        this.code = code;
        this.data = data;
    }

    public static <T> Result<?> ok(T data) {
        return new Result<>("ok", StatusCodeEnum.SUCCESS.getCode(), data);
    }

    public static <T> Result<?> clientError() {
        return new Result<>("clientError", StatusCodeEnum.CLIENT_ERROR.getCode(), null);
    }

    public boolean success() {
        return StatusCodeEnum.SUCCESS.getCode().equals(this.code);
    }
}
