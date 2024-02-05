/**
 * 功能描述：
 * 创建日期：2023 年 12 月 29 日
 */

// 使用严格模式
'use strict';

function getOpacityTransition(duration) {
    return `opacity ${duration}ms ease-in 0s`;
}

/**
 * 检查事件是否存在, 不存在直接抛出异常
 * @param eventName {string}
 */
function checkEventExist(eventName) {
    if (typeof eventName !== "string") {
        throw new Error(`eventName 参数必须是字符串, 而传入的参数为 : ${eventName}.`);
    }
    if(!("on".concat(eventName) in window)) {
        throw new Error(`事件 ${eventName} 不是一个有效的事件名称, 例如你可以输入 mouseenter.`);
    }
}

/**
 * 渐现动画
 * @param element {HTMLElement} 过渡元素
 * @param duration {number} 过渡时间
 * @param causeEle {HTMLElement} 导致 element 元素出现过渡的元素, 如果 element 同时也是 causeEle 时, 传入 null 即可
 * @param {string} [eventName = mouseleave] 导致 element 发生 fadeOut 的事件名称, 默认为 mouseleave
 * @returns {Promise<void>}
 */
function fadeIn(element, duration = 1000, causeEle, eventName = "mouseleave") {
    window.checkEventExist(eventName);

    return new Promise((resolve) => {
        let computedStyle;
        computedStyle = window.getComputedStyle(element);
        // 如果元素已经显示, 就设置初始的 opacity 为元素当前的 opacity, 而不是设置 0
        // !!!注意: 由于 display 有其他的取值, 显示元素不能使用 block
        if (computedStyle.display !== "none") {
            element.style.opacity = computedStyle.opacity;
        }
        // 如果当前元素没有显示, 就从 0 开始
        else {
            // 不能使用 block, 因为可能会有其他的取值
            element.style.display = "";
            element.style.opacity = "0";
            element.style.transition = window.getOpacityTransition(duration);
            element.clientHeight;
            computedStyle = window.getComputedStyle(element);
            // 看看设置了 display: "" 后元素是否显示, 如果还没有显示就设置 block
            if (computedStyle.display === "none") {
                element.style.display = "block";
                element.clientHeight;
            }
        }
        element.style.opacity = "1";
        let transitionEnd = () => {
            element.style.transition = "";
            element.style.opacity = "";
            removeEvent();
            resolve();
        };
        let removeEvent = () => {
            element.removeEventListener("transitionend", transitionEnd);
            !!causeEle && causeEle.removeEventListener(eventName, removeEvent);
        };
        element.addEventListener("transitionend", transitionEnd);
        !!causeEle && causeEle.addEventListener(eventName, removeEvent);
    });
}

/**
 * 渐隐动画
 * @param element {HTMLElement} 过渡元素
 * @param duration {number} 过渡时间
 * @param causeEle {HTMLElement} 导致 element 元素出现过渡的元素, 如果 element 同时也是 causeEle 时, 传入 null 即可
 * @param {string} [eventName = "mouseenter"] 导致 element 元素发生 fadeIn 的事件, 默认为 mouseenter
 * @returns {Promise<void>}
 */
function fadeOut(element, duration = 1000, causeEle, eventName = "mouseenter") {
    window.checkEventExist(eventName);

    return new Promise((resolve) => {
        let computedStyle = window.getComputedStyle(element);
        element.style.transition = window.getOpacityTransition(duration);
        // 渐隐不会有 display: none 的情况, 所以元素必定显示, 不考虑 !important 的情况
        element.style.opacity = computedStyle.opacity;
        element.clientHeight;
        element.style.opacity = "0";
        let transitionEnd = () => {
            element.style.display = "none";
            element.style.transition = "";
            element.style.opacity = "";
            removeEvent();
            resolve();
        };
        let removeEvent = () => {
            element.removeEventListener("transitionend", transitionEnd);
            !!causeEle && causeEle.removeEventListener(eventName, removeEvent);
        };
        element.addEventListener("transitionend", transitionEnd);
        !!causeEle && causeEle.addEventListener(eventName, removeEvent);
    });
}

function showElement(modifyOpacity = false) {
    if (this instanceof HTMLElement) {
        this.style.display = "";
        if(modifyOpacity) {
            this.style.opacity = "";
        }
        document.documentElement.clientHeight;

        let computedStyle = getComputedStyle(this);
        // 判断是否有其他样式覆盖当前样式
        if (computedStyle.display === "none") {
            this.style.display = "block";
        }
        if(modifyOpacity && computedStyle.opacity === "0") {
            this.style.opacity = "1";
        }
    }
}

function hideElement(modifyOpacity = false) {
    if(this instanceof HTMLElement) {
        this.style.display = "none";
        if(modifyOpacity) {
            this.style.opacity = "0";
        }
    }
}

/**
 * 显示元素
 * @type {function}
 */
Element.prototype.show = window.showElement;

/**
 * 隐藏元素
 * @type {function}
 */
Element.prototype.hide = window.hideElement;