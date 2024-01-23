/**
 * 功能描述：
 * 创建日期：2024 年 01 月 06 日
 */

// 使用严格模式
'use strict';

/**
 * 使用的浏览器类型
 * @type {{fireBox: number, chrome: number, safari: number, edge: number, ie: number, unknown: number}}
 */
const browserType = {
    fireBox: 0,
    chrome: 1,
    safari: 2,
    edge: 3,
    ie: 4,
    unknown: 5
};

/**
 * 进制转换
 * @param number {number} 要转化的数字
 * @param [radix = 10] {!number} 进制, 默认 10
 * @param [length] {number} 十六进制字符串的长度, 如果比转化的字符串长度小, 则 length 被忽略
 * @param [fillChar = "0"] {string} 如果 length 小于转化后的字符串长度, 则使用 fillChar 填充, 默认填充 0
 * @return {string} 转化后的字符串
 * @example 例如将数字 1 转化为十进制, 并要求转化后的字符串长度为 2, radixConversion(1, 10, 2) // "01"
 */
function radixConversion(number, radix = 10, length, fillChar = "0") {
    return number.toString(radix ?? 10).padStart(length, fillChar);
}

/**
 * 获取防抖函数
 * @param fn {function} 要防抖的函数
 * @param delay {number} 延迟执行的时间, 单位是毫秒
 * @return {{timeout: function(...*): Promise, abort: function(): void}}
 * 1. timeout: 执行防抖函数, 会返回一个 promise, 当 fn 执行完毕时执行 resolve, 传入 fn 的返回值
 * 2. abort: 取消防抖函数的执行
 */
function getDebounce(fn, delay) {
    let timer = null;

    let clear = () => {
        if (timer != null) {
            window.clearTimeout(timer);
            timer = null;
        }
    };
    return {
        timeout: function (...args) {
            return new Promise((resolve) => {
                clear();
                timer = window.setTimeout(() => {
                    let res = fn(...args);
                    resolve(res);
                }, delay);
            });
        },
        abort: clear
    };
}

/**
 * 获取节流函数
 * @param fn {function} 要节流的函数
 * @param delay {number} 延迟执行的时间, 单位是毫秒
 * @return {function(...*): *}
 */
function getThrottle(fn, delay) {
    let now, last;
    return function (...args) {
        now = performance.now();
        if (!(last && now < last + delay)) {
            last = now;
            return fn && fn(...args);
        }
    }
}

/**
 * 根据字符的类型 (全角 / 半角) 来计算字符串的长度, 全角字符长度记作 2, 半角字符长度记作 1 <br>
 * 半角字符 Unicode 编码范围: [0x00, 0xFF] 及 [0xFF61, 0xFF9F], 剩下的都是全角字符 <br>
 * @param str {string} 字符串
 * @return {number} 字符串的长度
 */
function calcLengthByHalfAndFullWidth(str) {
    let length = 0;
    for (let index = 0, strLength = str.length; index < strLength; index++) {
        let char = str.charCodeAt(index);
        if ((char >= 0x00 && char <= 0xFF) || (char >= 0xFF61 && char <= 0xFF9F)) {
            length++;
        } else {
            length += 2;
        }
    }
    return length;
}

function getBrowserType() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Firefox')) {
        // 用户使用 Firefox 浏览器
        return browserType.fireBox;
    } else if (userAgent.includes('Chrome')) {
        // 用户使用 Chrome 浏览器
        return browserType.chrome;
    } else if (userAgent.includes('Safari')) {
        // 用户使用 Safari 浏览器
        return browserType.safari;
    } else if (userAgent.includes('Edge')) {
        // 用户使用 Edge 浏览器
        return browserType.edge;
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
        // 用户使用 Internet Explorer 浏览器
        return browserType.ie;
    } else {
        // 无法确定用户使用的浏览器
        return browserType.unknown;
    }
}

/**
 * 将数字转化为 (分钟:秒) 格式的时间字符串
 * @param number {number} 十进制数字
 * @return {string} 转化后的时间字符串
 */
function formatToMinuteSecondTime(number) {
    let radixConversion = window.radixConversion;

    number = Math.floor(number);
    let seconds = Math.floor(number % 60);
    let minutes = Math.floor(number / 60 % 60);
    return `${radixConversion(minutes, 10, 2)}:${radixConversion(seconds, 10, 2)}`;
}

/**
 * 该函数会返回一个任务队列, 该队列可以设置最大可以执行的任务数量.
 * 如果达到了最大的任务数量, 会删除最早添加的任务, 然后添加新的任务.
 * @param {number} [maxTaskCount = 2] 最大可以执行的任务数量, 默认为 2
 * @return {{addTask: (function(function): void)}} 返回一个对象
 * 1. addTask: 添加任务到任务队列, 如果任务队列已满, 则删除最早添加的任务, 然后添加新的任务.
 */
function buildTaskQueue(maxTaskCount = 2) {
    maxTaskCount = maxTaskCount ?? 2;

    let taskQueue = [];
    let running = false;

    let addTask = (task, ...args) => {
        if (typeof task !== "function") return;
        // 当任务数量达到最大数量就移除最先添加的任务
        if (taskQueue.length >= maxTaskCount) {
            taskQueue.shift();
        }
        let taskFn = () => {
            return new Promise((resolve, reject) => {
                try {
                    let res = task(...args);
                    resolve(res);
                } catch (e) {
                    reject(e);
                }
            });
        };
        taskQueue.push(taskFn);

        if(!running) {
            window.setTimeout(runTask, 50);
        }
    };

    let runTask = () => {
        if (taskQueue.length === 0) {
            running = false;
            return;
        }
        running = true;
        let task = taskQueue.shift();
        task && task().then(runTask).catch(console.log);
    };

    return {
        addTask,
    };
}
