/**
 * 功能描述：
 * 创建日期：2023 年 12 月 29 日
 */

// 使用严格模式
'use strict';

function getFadeTransition(duration) {
    return `opacity ${duration}ms`;
}

/**
 * 检查必要的参数, 不符合直接抛出异常
 * @param causeEvent {string} 导致透明度渐变的事件名称
 */
function checkFadeParams(causeEvent) {
    if (typeof causeEvent !== "string") {
        throw new Error(`causeEvent 参数必须是字符串, 而传入的参数为 : ${causeEvent}`);
    }
}

/**
 * 渐现动画
 * @param element {HTMLElement} 过渡元素
 * @param duration {number} 过渡时间
 * @param causeEle {HTMLElement} 导致 element 元素出现过渡的元素, 没有则传 null
 * @param {string} [causeEvent = "mouseenter"] 导致 element 元素发生过渡的事件, 默认为 mouseenter
 * @returns {Promise<void>}
 */
function fadeIn(element, duration = 1000, causeEle, causeEvent = "mouseenter") {
    window.checkFadeParams(causeEvent);

    return new Promise((resolve) => {
        let computedStyle;
        computedStyle = getComputedStyle(element);
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
            element.style.transition = getFadeTransition(duration);
            element.clientHeight;
            computedStyle = getComputedStyle(element);
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
            !!causeEle && causeEle.removeEventListener("mouseleave", removeEvent);
        };
        element.addEventListener("transitionend", transitionEnd);
        !!causeEle && causeEle.addEventListener("mouseleave", removeEvent);
    });
}

/**
 * 渐隐动画
 * @param element {HTMLElement} 过渡元素
 * @param duration {number} 过渡时间
 * @param causeEle {HTMLElement} 导致 element 元素出现过渡的元素, 没有则传 null
 * @param {string} [causeEvent = "mouseenter"] 导致 element 元素发生过渡的事件, 默认为 mouseenter
 * @returns {Promise<void>}
 */
function fadeOut(element, duration = 1000, causeEle, causeEvent = "mouseenter") {
    window.checkFadeParams(causeEvent);

    return new Promise((resolve) => {
        let computedStyle = getComputedStyle(element);
        element.style.transition = getFadeTransition(duration);
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
            !!causeEle && causeEle.removeEventListener(causeEvent, removeEvent);
        };
        element.addEventListener("transitionend", transitionEnd);
        !!causeEle && causeEle.addEventListener(causeEvent, removeEvent);
    });
}

function showElement() {
    if (this instanceof HTMLElement) {
        this.style.display = "";
        document.documentElement.clientHeight;
        let computedStyle = getComputedStyle(this);
        if (computedStyle.display === "none") {
            this.style.display = "block";
        }
    }
}

function hideElement() {
    if(this instanceof HTMLElement) {
        this.style.display = "none";
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