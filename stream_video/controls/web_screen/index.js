/**
 * 功能描述：
 * 创建日期：2023 年 12 月 28 日
 */

// 使用严格模式
'use strict';

let webScreen = false;
const enterWebScreenTip = "进入网页全屏";
const exitWebScreenTip = "退出网页全屏";
const webScreenClassName = "web-screen";

const webScreenTipBoard = document.querySelector(".web-screen-tip-board");
const enterWebScreenIcon = document.querySelector(".enter-web-screen-icon");
const exitWebScreenIcon = document.querySelector(".exit-web-screen-icon");

function enterWebScreenHandler() {
    webScreen = true;
    videoContainer.classList.add(webScreenClassName);
    webScreenTipBoard.innerText = exitWebScreenTip;
}

function exitWebScreenHandler() {
    webScreen = false;
    videoContainer.classList.remove(webScreenClassName);
    webScreenTipBoard.innerText = enterWebScreenTip;
}

window.enterOrExitControlTipInitial(webScreenTipBoard, enterWebScreenIcon, exitWebScreenIcon, enterWebScreenTip);

enterWebScreenIcon.addEventListener("click", window.enterWebScreenHandler);
exitWebScreenIcon.addEventListener("click", window.exitWebScreenHandler);
