/**
 * 功能描述：
 * 创建日期：2023 年 12 月 29 日
 */

// 使用严格模式
'use strict';

let speed;
let lastSpeed;
let accelerating = false;

const commonSpeed = "1.0";
const accelerateSpeed = "3.0";
const commonSpeedText = "倍速";
const speedValues = ["2.0", "1.5", "1.25", "1.0", "0.75", "0.5"];

const speedContainer = document.querySelector(".speed-container");
const speedList = document.querySelector(".speed-list");
const speedItem = document.querySelector(".speed-item");
const speedWord = document.querySelector(".speed-word");

function showSpeedList() {
    window.fadeIn(speedList, videoControlsDuration, speedContainer).then(() => {});
}

function hideSpeedList() {
    window.fadeOut(speedList, videoControlsDuration, speedContainer).then(() => {});
}

/**
 * 改变视频速度
 * @param e {MouseEvent} 事件对象
 */
function changeVideoSpeed(e) {
    let target = e.target;
    let datasetSpeed = target.dataset.speed;
    let activeSpeedItem = speedList.querySelector(`.speed-item.${activeClassName}`);
    activeSpeedItem.classList.remove(activeClassName);
    target.classList.add(activeClassName);

    video.playbackRate = datasetSpeed;
    speed = datasetSpeed;
    speedWord.innerText = datasetSpeed === commonSpeed ? commonSpeedText : (`${datasetSpeed}x`);
    hideSpeedList();
}

/**
 * 按下加速视频速度至 accelerateSpeed
 * @param e {KeyboardEvent} 事件对象
 */
function keydownToSpeedUp(e) {
    if(e.code === arrowRightCode && !accelerating) {
        window.addEventListener("keyup", keyupToResetSpeed);

        window.playVideo();
        accelerating = true;
        lastSpeed = video.playbackRate;
        video.playbackRate = accelerateSpeed;
    }
}

/**
 * 鼠标弹起重置视频速度
 * @param e {KeyboardEvent} 事件对象
 */
function keyupToResetSpeed(e) {
    if(e.code === arrowRightCode) {
        window.removeEventListener("keyup", keyupToResetSpeed);

        accelerating = false;
        video.playbackRate = lastSpeed;
    }
}

(function () {
    speedItem.remove();
    speedValues.forEach((speed) => {
        let speedItemClone = speedItem.cloneNode(true);
        speedItemClone.innerText = `${speed}x`;
        speedItemClone.dataset.speed = speed;
        if (speed === commonSpeed) {
            speedItemClone.classList.add(activeClassName);
        }
        speedList.appendChild(speedItemClone);
    });
})();

window.addKeydownHandler(arrowRightCode, window.keydownToSpeedUp);
speedContainer.addEventListener("mouseenter", window.showSpeedList);
speedContainer.addEventListener("mouseleave", window.hideSpeedList);
speedList.addEventListener("click", window.changeVideoSpeed);
