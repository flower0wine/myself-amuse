package com.example.fragment.enity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author flowerwine
 * @date 2023 年 12 月 01 日
 */
@Setter
@Getter
@ToString
@NoArgsConstructor
public class FileHistory {
    private String[] fileHash;
    private String suffix;
}



