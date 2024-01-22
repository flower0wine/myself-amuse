/**
 * 功能描述：
 * 创建日期：2023 年 12 月 26 日
 */

// 使用严格模式
'use strict';

let fullScreen = false;
const fullScreenClassName = "full-screen";
const enterFullScreenTip = "进入全屏";
const exitFullScreenTip = "退出全屏";

const enterFullScreenIcon = document.querySelector(".enter-full-screen-icon");
const exitFullScreenIcon = document.querySelector(".exit-full-screen-icon");
const fullScreenTipBoard = document.querySelector(".full-screen-tip-board");

/**
 * 进入全屏模式
 */
function nativeJSEnterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

function nativeJSExitFullscreen() {
    if(!window.isFullscreen()) {
        return;
    }
    let document = window.document;
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

function isFullscreen() {
    let document = window.document;
    return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
}

function enterFullScreen() {
    fullScreen = true;
    window.nativeJSEnterFullscreen(videoBox);
    videoBox.classList.add(fullScreenClassName);
    fullScreenTipBoard.innerText = exitFullScreenTip;
    window.exitWebScreenHandler && window.exitWebScreenHandler();
}

function exitFullScreen() {
    fullScreen = false;
    window.nativeJSExitFullscreen();
    videoBox.classList.remove(fullScreenClassName);
    fullScreenTipBoard.innerText = enterFullScreenTip;
    window.exitWebScreenHandler && window.exitWebScreenHandler();
}

/**
 * 在全屏和非全屏状态之间切换
 */
function switchFullScreen() {
    if (window.isFullscreen()) {
        window.exitFullScreen();
    } else {
        window.enterFullScreen(videoBox);
    }
}

function keyupToSwitchFullScreen(e) {
    if(e.code === fCode) {
        window.switchFullScreen();
    }
}

window.enterOrExitControlTipInitial(fullScreenTipBoard, enterFullScreenIcon, exitFullScreenIcon, enterFullScreenTip);

window.addKeyupHandler(fCode, window.keyupToSwitchFullScreen);
enterFullScreenIcon.addEventListener("click", window.enterFullScreen);
exitFullScreenIcon.addEventListener("click", window.exitFullScreen);
videoChangeStatus.addEventListener("dblclick", window.switchFullScreen);