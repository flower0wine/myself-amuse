/**
 * 功能描述：
 * 创建日期：2023 年 12 月 27 日
 */

// 使用严格模式
'use strict';

let durationFormatText;

const videoPlayTime = document.querySelector(".play-time");

function formatMinuteSecond(minutes, seconds) {
    let radixConversion = window.radixConversion;
    return `${radixConversion(minutes, 10, 2)}:${radixConversion(seconds, 10, 2)}`;
}

function videoLoadedMetadata() {
    let all = Math.floor(video.duration);
    let seconds = Math.floor(all % 60);
    let minutes = Math.floor(all / 60 % 60);
    durationFormatText = window.formatMinuteSecond(minutes, seconds);
    updateVideoTime();
}

/**
 * 更新视频播放时间, 监听 video 的 timeupdate 事件
 * @param {number} [currentTime] 视频当前播放时间
 */
function updateVideoTime(currentTime) {
    currentTime = currentTime ?? video.currentTime;
    currentTime = Math.floor(currentTime);
    let seconds = Math.floor(currentTime % 60);
    let minutes = Math.floor(currentTime / 60 % 60);
    videoPlayTime.innerText = `${window.formatMinuteSecond(minutes, seconds)} / ${durationFormatText}`;
}

function updateTimeHandler() {
    updateVideoTime();
}

window.addEventListener("updateVideoTime", window.updateVideoTime);
video.addEventListener("timeupdate", window.updateTimeHandler);
video.addEventListener("loadedmetadata", window.videoLoadedMetadata);