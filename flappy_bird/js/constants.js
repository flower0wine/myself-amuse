/**
 * 功能描述：定义常量
 * 创建日期：2023 年 12 月 13 日
 */

// 使用严格模式
'use strict';

const arrowUpCode = "ArrowUp";
const escCode = "Escape";
const spaceCode = "Space";

/**
 * 将图片路径用 url() 包裹
 * @param imagePath {string} 图片路径
 * @return {string} 返回 url('图片路径')
 */
function getImagesUrl(imagePath) {
    return `url('${imagePath}')`;
}