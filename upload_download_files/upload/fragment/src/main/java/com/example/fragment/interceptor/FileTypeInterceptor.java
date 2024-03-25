package com.example.fragment.interceptor;

import cn.hutool.json.JSONUtil;
import com.example.fragment.enity.Result;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Objects;

/**
 * @author flowerwine
 * @date 2024 年 03 月 25 日
 */
@Component
public class FileTypeInterceptor implements HandlerInterceptor {
    private String[] prohibitSuffix = new String[]{
            ".exe",
    };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        boolean pass;
        String filename = request.getParameter("filename");
        if(Objects.isNull(filename)) {
            pass = false;
        } else {
            int dotIndex = filename.lastIndexOf(".");
            if(dotIndex == -1 || filename.length() == dotIndex) {
                pass = false;
            } else {
                String suffix = filename.substring(dotIndex);
                pass = Arrays.asList(prohibitSuffix).contains(suffix);
            }
        }
        if(!pass) {
            response.getWriter().write(JSONUtil.toJsonStr(Result.clientError()));
        }
        return pass;
    }
}
