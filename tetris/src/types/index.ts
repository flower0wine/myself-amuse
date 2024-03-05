/* 
  功能描述: TS 类型
  创建时间: 2024年 03月 05日
 */
"use strict";

import type {DeepReadonly, Ref} from "vue";

export interface GetRunning {
    running: DeepReadonly<Ref>,
    set: (r: boolean) => void
}

export interface GetStarted {
    started: DeepReadonly<Ref>,
    set: (r: boolean) => void
}

export interface DowningGrid {
    downingGrid: number[],
    width: number,
    height: number
}