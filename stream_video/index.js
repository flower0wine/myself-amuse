/**
 * 功能描述：
 * 创建日期：2023 年 12 月 26 日
 */

// 使用严格模式
'use strict';
const mCode = "KeyM";
const fCode = "KeyF";
const spaceCode = "Space";
const arrowUpCode = "ArrowUp";
const arrowDownCode = "ArrowDown";
const arrowLeftCode = "ArrowLeft";
const arrowRightCode = "ArrowRight";

const video = document.querySelector(".video");
const videoBox = document.querySelector(".video-box");
const videoContainer = document.querySelector(".video-container");
const videoChangeStatus = document.querySelector(".video-change-status");
const videoControls = document.querySelector(".video-controls");

const activeClassName = "active";
const pauseClassName = "pause";
const showClassName = "show";
const hiddenClassName = "hidden";
const meClassName = "me";
const hiddenCursor = "hidden-cursor";
const videoControlsDuration = 500;
/**
 * 显示控件后执行的回调
 * @type {[function]}
 */
const showControlsCallbackArr = [];
/**
 * 隐藏控件后执行的回调
 * @type {[function]}
 */
const hideControlsCallbackArr = [];
/**
 * videoBox 尺寸变化执行的回调函数
 * @type {[function]}
 */
const videoBoxResizeCallbackArr = [];

/**
 * 键盘按下事件处理程序集合 <br>
 * map 的 key 是按键对应的 code (如: 空格的 code 为 Space) <br>
 * value 是事件处理程序数组
 * @type {Map<string, function[]>}
 */
const keyDownHandlerMap = new Map();

/**
 * 键盘抬起事件处理程序集合 <br>
 * map 的 key 是按键对应的 code (如: 空格的 code 为 Space) <br>
 * value 是事件处理程序数组
 * @type {Map<string, function[]>}
 */
const keyUpHandlerMap = new Map();

/**
 * 正在使用的浏览器类型
 * @type {number}
 */
const usingBrowserType = window.getBrowserType();

/**
 * 视频的总时间
 * @type {number}
 */
let videoDuration;
/**
 * 控件是否显示
 * @type {boolean}
 */
let controlsShow;

let videoBoxWidth;
let videoBoxHeight;
let videoBoxResizeObserver;
let pause = true;
let enterControls = false;

/**
 * 视频是否初始化
 * @type {boolean}
 */
let videoInitialized = false;
/**
 * 是否禁用键盘处理程序
 * @type {boolean}
 */
let disableShortcutKeys = false;
/**
 * 隐藏控件防抖, 防抖就是在最后一次触发时再执行
 * @type {{timeout: (function(...[*]): Promise), abort: (function(): void)}}
 */
let hiddenControlsDebounce = getDebounce(window.hiddenControls, 2000);

/**
 * 显示节流, 节流就是在指定的时间内执行一次
 * @type {function(...[*]): *}
 */
let showControlsThrottle = getThrottle(window.showControls, 100);

/**
 * 显示控件, 不定时隐藏
 */
function showControlsNotSchedule() {
    controlsShow = true;
    window.fadeIn(videoControls, videoControlsDuration, videoBox, "mousemove").then(() => {
        window.execCallback(showControlsCallbackArr);
    });
    videoBox.classList.remove(hiddenCursor);
}

/**
 * 直接显示控件, 并定时隐藏
 */
function showControls() {
    window.showControlsNotSchedule();
    if (!pause) {
        window.scheduleHiddenControls();
    }
}

/**
 * 直接隐藏控件
 */
function hiddenControls() {
    if (!enterControls && !pause) {
        window.fadeOut(videoControls, videoControlsDuration, videoBox, "mousemove").then(() => {
            controlsShow = false;
            window.execCallback(hideControlsCallbackArr);
        });
        videoBox.classList.add(hiddenCursor);
    }
}

/**
 * 定时隐藏控件
 */
function scheduleHiddenControls() {
    if (enterControls || pause) {
        return;
    }
    hiddenControlsDebounce.timeout().then(() => {
    });
}

/**
 * 鼠标在 videoBox 元素中持续移动
 */
function mousemoveInVideoBox() {
    // 节流
    showControlsThrottle();
}

/**
 * 鼠标移入视频控件时触发, 清除隐藏控件的定时器
 */
function mouseenterVideoControls() {
    enterControls = true;
    hiddenControlsDebounce.abort();
}

/**
 * 鼠标移出视频控件时触发, 设置隐藏控件的定时器
 */
function mouseleaveVideoControls() {
    enterControls = false;
    window.scheduleHiddenControls();
}

/**
 * 执行回调函数
 * @param callbackArr {function[]} 回调函数数组
 * @param args {...*} 传入函数的形参
 */
function execCallback(callbackArr, ...args) {
    callbackArr.forEach((fn) => {
        fn(...args);
    });
}

/**
 * 点击进入或者退出某个模式的初始化函数. <br>
 * tipBoard 元素会在鼠标移入 enterEle 或者 exitEle 时显示. <br>
 * 初始时认为未进入指定模式, 所以只能填写进入时的提示 enterTip. <br>
 * 点击 enterEle 进入模式, 点击 exitEle 退出模式.
 * @param tipBoard {HTMLElement} 提示面板元素
 * @param enterEle {HTMLElement} 点击进入模式的按钮
 * @param exitEle {HTMLElement} 点击退出模式的按钮
 * @param enterTip {string} 点击进入模式时的提示
 */
function enterOrExitControlTipInitial(tipBoard, enterEle, exitEle, enterTip) {

    let showTipBoard = (causeEle) => {
        window.fadeIn(tipBoard, videoControlsDuration, causeEle).then(() => {
        });
    }

    let hiddenTipBoard = (causeEle) => {
        window.fadeOut(tipBoard, videoControlsDuration, causeEle).then(() => {
        });
    }

    let initial = () => {
        tipBoard.innerText = enterTip;
    };

    initial();

    enterEle.addEventListener("mouseenter", showTipBoard.bind(null, enterEle));
    exitEle.addEventListener("mouseenter", showTipBoard.bind(null, exitEle));
    enterEle.addEventListener("mouseleave", hiddenTipBoard.bind(null, enterEle));
    exitEle.addEventListener("mouseleave", hiddenTipBoard.bind(null, exitEle));
}

function videoBoxResizeObserverCallback(entries) {
    let entry = entries[0];
    let videoBox = entry.target;
    videoBoxWidth = videoBox.clientWidth;
    videoBoxHeight = videoBox.clientHeight;
    videoBoxResizeCallbackArr.forEach((fn) => {
        fn(entry);
    });
}

/**
 * 禁用所有的快捷键
 */
function disableKeyboardShortcutKeys() {
    disableShortcutKeys = true;
}

/**
 * 开启所有的快捷键
 */
function ableKeyboardShortcutKeys() {
    disableShortcutKeys = false;
}

/**
 * 键盘事件处理程序
 * @param map {Map<string, function[]>} 按键编码到处理函数的映射
 * @param e {KeyboardEvent} 事件对象
 */
function keyBoardHandler(map, e) {
    if (disableShortcutKeys) return;
    let code = e.code;
    if (map.has(code)) {
        map.get(code).forEach((fn) => {
            fn(e);
        });
    }
}

/**
 * 添加键盘按下事件处理程序
 * @param code {!string} 按键编码, 如空格为 Space
 * @param fn {!function} 处理函数
 */
function addKeydownHandler(code, fn) {
    window.addKeyBoardHandler(keyDownHandlerMap, code, fn);
}

/**
 * 添加键盘抬起事件处理程序
 * @param code {!string} 按键编码, 如空格为 Space
 * @param fn {!function} 处理函数
 */
function addKeyupHandler(code, fn) {
    window.addKeyBoardHandler(keyUpHandlerMap, code, fn);
}

function addKeyBoardHandler(map, code, fn) {
    if (map.has(code)) {
        map.get(code).push(fn);
    } else {
        map.set(code, [fn]);
    }
}

function videoBarrageInitial() {
    if(videoInitialized) return;
    videoInitialized = true;
    controlsShow = true;
    videoDuration = video.duration;
    videoBoxWidth = videoBox.clientWidth;
    videoBoxHeight = videoBox.clientHeight;

    videoBoxResizeObserver = new ResizeObserver(window.videoBoxResizeObserverCallback);
    videoBoxResizeObserver.observe(videoBox);

    videoContainer.classList.remove(hiddenClassName);
}

window.addEventListener("keydown", window.keyBoardHandler.bind(null, keyDownHandlerMap));
window.addEventListener("keyup", window.keyBoardHandler.bind(null, keyUpHandlerMap));
video.addEventListener("loadedmetadata", window.videoBarrageInitial);
video.addEventListener("loadeddata", window.videoBarrageInitial);
video.addEventListener("loadstart", window.videoBarrageInitial);
videoBox.addEventListener("mousemove", window.mousemoveInVideoBox);
videoControls.addEventListener("mouseenter", window.mouseenterVideoControls);
videoControls.addEventListener("mouseleave", window.mouseleaveVideoControls);







