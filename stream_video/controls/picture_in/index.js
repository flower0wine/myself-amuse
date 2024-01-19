/**
 * 功能描述：
 * 创建日期：2023 年 12 月 29 日
 */

// 使用严格模式
'use strict';

let pictureIn = false;
const pictureInClassName = "picture-in";
const enterPictureInTip = "进入画中画";
const exitPictureInTip = "退出画中画";

const pictureInTipBoard = document.querySelector(".picture-in-tip-board");
const pictureInContainer = document.querySelector(".picture-in-container");
const enterPictureInIcon = document.querySelector(".enter-picture-in-icon");
const exitPictureInIcon = document.querySelector(".exit-picture-in-icon");

function enterPictureIn() {
    let succeed = () => {
        pictureInContainer.classList.add(pictureInClassName);
        pictureInTipBoard.innerText = exitPictureInTip;
    };

    video.requestPictureInPicture().then(succeed);
}

function exitPictureIn() {
    let succeed = () => {
        pictureInContainer.classList.remove(pictureInClassName);
        pictureInTipBoard.innerText = enterPictureInTip;
    };

    document.exitPictureInPicture().then(succeed);
}

/**
 * 画中画初始化
 */
function pictureInInitial() {
    // firebox 不支持 js 开启画中画
    if(!video.requestPictureInPicture) {
        pictureInContainer.remove();
        return;
    }
    pictureIn = document.pictureInPictureElement === null;
}

window.enterOrExitControlTipInitial(pictureInTipBoard, enterPictureInIcon, exitPictureInIcon, enterPictureInTip);

video.addEventListener("loadedmetadata", window.pictureInInitial);
enterPictureInIcon.addEventListener("click", window.enterPictureIn);
exitPictureInIcon.addEventListener("click", window.exitPictureIn);
