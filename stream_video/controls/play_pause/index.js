/**
 * 功能描述：
 * 创建日期：2023 年 12 月 27 日
 */

// 使用严格模式
'use strict';

const playTip = "播放";
const pauseTip = "暂停";

const pauseIcon = document.querySelector(".video-status .pause-icon");
const playIcon = document.querySelector(".video-status .play-icon");
const videoStatusTipBoard = document.querySelector(".video-status-tip-board");

/**
 * 播放视频后执行的回调函数
 * @type {[function]}
 */
const playVideoCallbackArr = [];
/**
 * 暂停视频后执行的回调函数
 * @type {[function]}
 */
const pauseVideoCallbackArr = [];

function pauseVideo() {
    video.pause();
    videoStatusTipBoard.innerText = playTip;
}

function playVideo() {
    video.play();
    videoStatusTipBoard.innerText = pauseTip;
}

function togglePauseClassName() {
    videoContainer.classList.toggle(PAUSE_CLASS_NAME);
}

function playVideoHandler() {
    pause = false;
    window.togglePauseClassName();
    window.scheduleHiddenControls();
    window.execCallback(playVideoCallbackArr);
}

function pauseVideoHandler() {
    pause = true;
    window.togglePauseClassName();
    window.showControlsNotScheduleHide();
    window.execCallback(pauseVideoCallbackArr);
}

/**
 * 改变视频状态, 即暂停和播放
 */
function changeVideoStatus() {
    if (pause) {
        window.playVideo();
    } else {
        window.pauseVideo();
    }
}

function keyupToSwitchVideoStatus(e) {
    if (e.code === spaceCode) {
        window.changeVideoStatus();
    }
}

window.enterOrExitControlTipInitial(videoStatusTipBoard, playIcon, pauseIcon, playTip);

window.addKeyupHandler(spaceCode, window.keyupToSwitchVideoStatus);
video.addEventListener("play", window.playVideoHandler);
video.addEventListener("pause", window.pauseVideoHandler);
playIcon.addEventListener("click", window.playVideo);
pauseIcon.addEventListener("click", window.pauseVideo);
videoChangeStatus.addEventListener("click", window.changeVideoStatus);
