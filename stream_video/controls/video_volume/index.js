/**
 * 功能描述：
 * 创建日期：2023 年 12 月 27 日
 */

// 使用严格模式
'use strict';

let muted;
let volume;
let lastVolume;
let minOffsetY;
let maxOffsetY;

const speedIncrement = 0.01;
const mutedClassName = "muted";

const volumeWord = document.querySelector(".volume-word");
const volumeContainer = document.querySelector(".volume-container");
const volumeProgressContainer = document.querySelector(".volume-progress-container");
const volumeThumb = document.querySelector(".volume-thumb");
const volumeInnerTrack = document.querySelector(".volume-inner-track");
const volumeBar = document.querySelector(".volume-bar");
const mutedIcon = document.querySelector(".volume-container .muted-icon");
const noMutedIcon = document.querySelector(".volume-container .no-muted-icon");
const volumeAdjustContainer = document.querySelector(".volume-adjust-container");
const volumeMoveBoard = document.querySelector(".volume-move-board");

function volumeChangeHandler() {
    muted = video.muted;
    volume = video.volume;
}

function clickVolumeProgressContainer(clickEvent) {
    let clickOffsetY = clickEvent.offsetY;
    let mousemove = false;

    if(!clickOffsetY) return;

    let mousemoveInVolumeBar = (mousemoveEvent) => {
        mousemove = true;
        let mousemoveOffsetY = mousemoveEvent.offsetY;
        window.setVideoVolumeByOffsetY(mousemoveOffsetY);
    };
    let mouseleaveVolumeBar = () => {
        removeAllEvent();
    };
    let mouseupInVolumeBar = () => {
        removeAllEvent();
        if (!mousemove) {
            window.setVideoVolumeByOffsetY(clickOffsetY);
        }
    };
    let removeAllEvent = () => {
        volumeMoveBoard.removeEventListener("mousemove", mousemoveInVolumeBar);
        volumeMoveBoard.removeEventListener("mouseleave", mouseleaveVolumeBar);
        volumeMoveBoard.removeEventListener("mouseup", mouseupInVolumeBar);
    }
    volumeMoveBoard.addEventListener("mousemove", mousemoveInVolumeBar);
    volumeMoveBoard.addEventListener("mouseleave", mouseleaveVolumeBar);
    volumeMoveBoard.addEventListener("mouseup", mouseupInVolumeBar);
}

function setVideoVolumeByVolumeNumber(volume) {
    setVideoVolumeByOffsetY(minOffsetY + (100 - volume));
}

/**
 * 根据提供的 offsetY 来设置视频音量, 在这里 offsetY 越大, 音量越小, offsetY 的范围为 minOffsetY ~ maxOffsetY, 设置的音量范围为 0 ~ 1
 * @param offsetY {number} 数值偏移量
 */
function setVideoVolumeByOffsetY(offsetY) {
    if (offsetY >= maxOffsetY) {
        muteVideo();
    } else {
        let translateY;
        if (offsetY <= minOffsetY) {
            video.volume = 1;
            translateY = 0;
        } else {
            translateY = offsetY - minOffsetY;
            let volume = (100 - translateY) / 100;
            volume = volume < 0 ? 0 : volume;
            video.volume = volume;
        }
        window.unmuteVideo(false);
        setVolumeProgressTransform(translateY);
        setVolumeWord(100 - translateY);
    }
}

/**
 * 设置音量进度条的 translateY
 * @param translateY {number} 偏移量
 */
function setVolumeProgressTransform(translateY) {
    translateY = Math.floor(translateY);
    volumeThumb.style.transform = `translateY(${translateY}px)`;
    volumeInnerTrack.style.transform = `translateY(${translateY}px)`;
}

function setVolumeWord(volume) {
    volumeWord.innerText = Math.floor(volume);
}

/**
 * 静音视频
 */
function muteVideo() {
    if (!muted) {
        video.muted = true;
        video.volume = 0;
        lastVolume = volume;
        setVolumeProgressTransform(100);
        setVolumeWord(0);
        volumeContainer.classList.add(mutedClassName);
    }
}

/**
 * 解除视频静音
 * @param useLastVolume {boolean} 是否使用之前的音量
 */
function unmuteVideo(useLastVolume = true) {
    if (muted) {
        if (useLastVolume) {
            video.volume = lastVolume;
            setVolumeProgressTransform(100 - lastVolume * 100);
            setVolumeWord(lastVolume * 100);
        }
        video.muted = false;
        volumeContainer.classList.remove(mutedClassName);
    }
}

function clickUnMutedVideo() {
    window.unmuteVideo();
}

function showVolumeAdjustContainer() {
    window.fadeIn(volumeAdjustContainer, VIDEO_CONTROL_DURATION, volumeContainer).then(() => {});
}

function hideVolumeAdjustContainer() {
    window.fadeOut(volumeAdjustContainer, VIDEO_CONTROL_DURATION, volumeContainer).then(() => {});
}

function keyupEventHandlerOfVolume(e) {
    switch (e.code) {
        case mCode: {
            if (muted) {
                unmuteVideo();
            } else {
                muteVideo();
            }
            break;
        }
    }
}

function keydownEventHandlerOfVolume(e) {
    switch (e.code) {
        case arrowUpCode: {
            if (muted) {
                unmuteVideo();
            }
            // 让 volume 被赋值为 lastVolume 后再执行
            setTimeout(() => {
                window.setVideoVolumeByVolumeNumber((volume + speedIncrement) * 100)
            }, 0);
            break;
        }
        case arrowDownCode: {
            if(volume === 0) {
                break;
            }
            if (muted) {
                unmuteVideo();
            }
            // 让 volume 被赋值为 lastVolume 后再执行
            setTimeout(() => {
                window.setVideoVolumeByVolumeNumber((volume - speedIncrement) * 100)
            }, 0);
            break;
        }
    }
}

function initialVolume() {
    muted = video.muted;
    volume = video.volume;
    lastVolume = volume;
    let volumeBarRect = volumeBar.getBoundingClientRect();
    let volumeProgressContainerRect = volumeProgressContainer.getBoundingClientRect();
    let volumeBarWidth = volumeBarRect.width;
    let volumeBarHeight = volumeBarRect.height;
    let volumeProgressContainerHeight = volumeProgressContainerRect.height;
    let volumeBarHalfWidth = volumeBarWidth >> 1;

    // 获取鼠标在可移动区域内的可移动范围
    minOffsetY = ((volumeProgressContainerHeight - volumeBarHeight) >> 1) + (volumeBarHalfWidth);
    maxOffsetY = volumeProgressContainerHeight - minOffsetY;
    setVolumeWord(volume * 100);

    volumeAdjustContainer.classList.remove(SHOW_CLASS_NAME);
}

window.addKeyupHandler(mCode, window.keyupEventHandlerOfVolume);
window.addKeydownHandler(arrowUpCode, window.keydownEventHandlerOfVolume);
window.addKeydownHandler(arrowDownCode, window.keydownEventHandlerOfVolume);
video.addEventListener("loadedmetadata", window.initialVolume);
video.addEventListener("volumechange", window.volumeChangeHandler);
mutedIcon.addEventListener("click", window.clickUnMutedVideo);
noMutedIcon.addEventListener("click", window.muteVideo);
volumeContainer.addEventListener("mouseenter", window.showVolumeAdjustContainer);
volumeContainer.addEventListener("mouseleave", window.hideVolumeAdjustContainer);
volumeMoveBoard.addEventListener("mousedown", window.clickVolumeProgressContainer);
