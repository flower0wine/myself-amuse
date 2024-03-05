/* 
  功能描述: 下落方块的相关逻辑
  创建时间: 2024年 03月 01日
 */

import type {DowningGrid} from "@/types";

const downingGridInfo: Array<DowningGrid> = [
    //  1
    // 111
    {
        downingGrid: [2, 7],
        width: 3,
        height: 2
    },
    // 1
    // 11
    // 1
    {
        downingGrid: [2, 3, 2],
        width: 2,
        height: 3
    },
    // 111
    //  1
    {
        downingGrid: [7, 2],
        width: 3,
        height: 2
    },
    //  1
    // 11
    //  1
    {
        downingGrid: [1, 3, 1],
        width: 2,
        height: 3
    },
    // 1
    // 11
    //  1
    {
        downingGrid: [2, 3, 1],
        width: 2,
        height: 3
    },
    //  11
    // 11
    {
        downingGrid: [3, 6],
        width: 3,
        height: 2
    },
    //  1
    // 11
    // 1
    {
        downingGrid: [1, 3, 2],
        width: 2,
        height: 3
    },
    // 11
    //  11
    {
        downingGrid: [6, 3],
        width: 3,
        height: 2
    },
    // 1
    // 1
    // 1
    // 1
    {
        downingGrid: [1, 1, 1, 1],
        width: 1,
        height: 4
    },
    // 1111
    {
        downingGrid: [15],
        width: 4,
        height: 1
    },
    // 11
    // 11
    {
        downingGrid: [3, 3],
        width: 2,
        height: 2
    },
    // 1
    // 111
    {
        downingGrid: [4, 7],
        width: 3,
        height: 2
    },
    //  1
    //  1
    // 11
    {
        downingGrid: [1, 1, 3],
        width: 2,
        height: 3
    },
    // 111
    //   1
    {
        downingGrid: [7, 1],
        width: 3,
        height: 2
    },
    // 11
    // 1
    // 1
    {
        downingGrid: [3, 2, 2],
        width: 2,
        height: 3
    },
    //   1
    // 111
    {
        downingGrid: [1, 7],
        width: 3,
        height: 2
    },
    // 11
    //  1
    //  1
    {
        downingGrid: [3, 1, 1],
        width: 2,
        height: 3
    },
    // 111
    // 1
    {
        downingGrid: [7, 4],
        width: 3,
        height: 2
    },
    // 1
    // 1
    // 11
    {
        downingGrid: [2, 2, 3],
        width: 2,
        height: 3
    },
];

/**
 * 获取随机的下落方块
 * @return 返回一个对象, 其中包含了方块形状的 downGrid 数组, 还有 width 和 height 属性用来规定方块的尺寸
 */
export function getRandomDowningGrid(): DowningGrid {
    const index = Math.floor(Math.random() * downingGridInfo.length);
    const downingGridInfoItem = downingGridInfo[index];
    // 复制源对象
    const obj = Object.assign({}, downingGridInfoItem);
    obj.downingGrid = [...downingGridInfoItem.downingGrid];
    return obj;
}