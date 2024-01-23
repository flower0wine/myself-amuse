/**
 * 功能描述：
 * 创建日期：2023 年 12 月 27 日
 */

// 使用严格模式
'use strict';

let durationFormatText;

const videoPlayTime = document.querySelector(".play-time");



function videoLoadedMetadata() {
    durationFormatText = window.formatToMinuteSecondTime(video.duration);
    updateVideoTime();
}

/**
 * 更新视频播放时间, 监听 video 的 timeupdate 事件
 * @param {number} [currentTime] 视频当前播放时间
 */
function updateVideoTime(currentTime) {
    currentTime = currentTime ?? video.currentTime;
    videoPlayTime.innerText = `${window.formatToMinuteSecondTime(currentTime)} / ${durationFormatText}`;
}

function updateTimeHandler() {
    updateVideoTime();
}

window.addEventListener("updateVideoTime", window.updateVideoTime);
video.addEventListener("timeupdate", window.updateTimeHandler);
video.addEventListener("loadedmetadata", window.videoLoadedMetadata);