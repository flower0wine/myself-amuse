/**
 * 功能描述：
 * 创建日期：2023 年 12 月 30 日
 */

// 使用严格模式
'use strict';

let updateProgressing = false;

/**
 * 快进的时间间隔
 * @type {number}
 */
const intervalOfSkip = 3;

const currentProgress = document.querySelectorAll(".current-progress");
const bufferProgress = document.querySelectorAll(".buffer-progress");
const shadowProgressBox = document.querySelector(".shadow-progress-box");
const videoProgressContainer = document.querySelector(".video-progress-container");

function updateCurrentProgressHandler() {
    if (updateProgressing) return;
    window.updateCurrentProgress(video.currentTime);
}

function updateBufferProgressHandler() {
    if (video.buffered.length > 0) {
        bufferProgress.forEach((ele) => {
            ele.style.transform = `scaleX(${video.buffered.end(0) / videoDuration})`;
        });
    }
}

function updateCurrentProgress(currentTime) {
    window.updateVideoTime && window.updateVideoTime(currentTime);
    currentProgress.forEach((ele) => {
        ele.style.transform = `scaleX(${currentTime / videoDuration})`
    });
}

function updateVideoCurrentTime(currentTime) {
    video.currentTime = currentTime;
    window.updateCurrentProgress(currentTime);
}

function mousedownProgressContainer(e) {
    updateProgressing = true;
    let clickPageX = e.pageX;
    let mousemove = false;
    let progressContainerRect = videoProgressContainer.getBoundingClientRect();
    let progressContainerWidth = progressContainerRect.width;
    let progressContainerLeft = progressContainerRect.left;
    let minOffsetX = progressContainerLeft;
    let maxOffsetX = progressContainerLeft + progressContainerWidth;
    let movePageX;
    let getCurrentTime = (offsetX) => {
        return Math.floor((offsetX - minOffsetX) / progressContainerWidth * videoDuration);
    };
    let mousemoveInViewport = (e) => {
        mousemove = true;
        movePageX = e.pageX;
        window.updateCurrentProgress(getCurrentTime(movePageX));
    };
    let mouseupInViewPart = () => {
        removeEvent();
        if (!mousemove) {
            let currentTime = getCurrentTime(clickPageX);
            window.updateVideoCurrentTime(currentTime);
        } else {
            if (movePageX < minOffsetX) {
                window.updateVideoCurrentTime(0);
            } else if (movePageX > maxOffsetX) {
                window.updateVideoCurrentTime(videoDuration);
            } else {
                window.updateVideoCurrentTime(getCurrentTime(movePageX));
            }
        }
        updateProgressing = false;
    };
    let removeEvent = () => {
        window.removeEventListener("mousemove", mousemoveInViewport);
        window.removeEventListener("mouseup", mouseupInViewPart);
    };

    window.addEventListener("mousemove", mousemoveInViewport);
    window.addEventListener("mouseup", mouseupInViewPart);
}

function keyupToSkipInterval(e) {
    switch (e.code) {
        case arrowLeftCode:
            window.updateVideoCurrentTime(video.currentTime - intervalOfSkip);
            break;
        case arrowRightCode:
            window.updateVideoCurrentTime(video.currentTime + intervalOfSkip);
            break;
        default:
            break;
    }
}

showControlsCallbackArr.push(() => {
    shadowProgressBox.style.display = "none";
});

hideControlsCallbackArr.push(() => {
    shadowProgressBox.style.display = "block";
});

window.addKeyupHandler(arrowLeftCode, window.keyupToSkipInterval);
window.addKeyupHandler(arrowRightCode, window.keyupToSkipInterval);
video.addEventListener("timeupdate", updateCurrentProgressHandler);
video.addEventListener("progress", updateBufferProgressHandler);
videoProgressContainer.addEventListener("mousedown", window.mousedownProgressContainer);
