/**
 * 功能描述：
 * 创建日期：2024 年 03 月 24 日
 */

// 使用严格模式
'use strict';

function throttle(fn, delay) {
    let now = window.performance.now();
    return function (...args) {
        const last = window.performance.now();
        if(last - now > delay) {
            now = last;
            return fn.apply(this, args);
        }
    }
}
