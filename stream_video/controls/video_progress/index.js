/**
 * 功能描述：
 * 创建日期：2023 年 12 月 30 日
 */

// 使用严格模式
'use strict';

let videoCopy;
/**
 * 进度条有关信息
 * @type {{videoFramePreviewWidth: number,
 *         progressContainerWidth: number,
 *         progressContainerLeft: number,
 *         minOffsetX: number,
 *         maxOffsetX: number,
 *         getVideoTimeByOffsetX: function(number)}}
 */
let progressInfo;
/**
 * 视频帧预览有关信息
 * @type {{minOffsetX: number, maxOffsetX: number}}
 */
let videoFramePreviewInfo;
let timer;
let taskQueue;

let updateProgressing = false;
let videoFrameViewVisible = false;

/**
 * 快进/快退的时间间隔
 * @type {number}
 */
const intervalOfSkip = 3;

const currentProgress = document.querySelectorAll(".current-progress");
const bufferProgress = document.querySelectorAll(".buffer-progress");
const shadowProgressBox = document.querySelector(".shadow-progress-box");
const videoProgressContainer = document.querySelector(".video-progress-container");
const videoFrameView = document.querySelector(".video-frame-view");
const videoFramePreview = document.querySelector(".video-frame-preview");
const videoPreviewTime = videoFramePreview.querySelector(".video-time");

/**
 * 更新视频当前进度
 */
function updateCurrentProgressHandler() {
    if (updateProgressing) return;
    window.updateCurrentProgress(video.currentTime);
}

/**
 * 更新视频缓存进度条
 */
function updateBufferProgressHandler() {
    if (video.buffered.length > 0) {
        bufferProgress.forEach((ele) => {
            ele.style.transform = `scaleX(${video.buffered.end(0) / videoDuration})`;
        });
    }
}

/**
 * 更新视频进度
 * @param currentTime {number} 视频时间
 */
function updateCurrentProgress(currentTime) {
    window.updateVideoTime && window.updateVideoTime(currentTime);
    // 由于有两个进度条, 并且它们的偏移量是相同的, 所以这里使用循环
    currentProgress.forEach((ele) => {
        ele.style.transform = `scaleX(${currentTime / videoDuration})`
    });
}

/**
 * 更新视频时间
 * @param currentTime {number} 视频时间
 */
function updateVideoCurrentTime(currentTime) {
    video.currentTime = currentTime;
    window.flushBarrage();
    window.updateCurrentProgress(currentTime);
}

/**
 * 更新视频帧预览位置
 * @param offsetX {number} 偏移量
 */
function updateVideoFrameTranslateX(offsetX) {
    let {minOffsetX: progressMinOffsetX} = progressInfo;
    let {minOffsetX: framePreviewMinOffsetX, maxOffsetX: framePreviewMaxOffsetX} = videoFramePreviewInfo;
    let translateX = offsetX - framePreviewMinOffsetX;
    let maxTranslateX;
    if (translateX < 0) {
        translateX = 0;
    } else if (translateX > (maxTranslateX = framePreviewMaxOffsetX - progressMinOffsetX)) {
        translateX = maxTranslateX;
    }
    videoFramePreview.style.transform = `translateX(${translateX}px)`;
}

/**
 * 检查 pageX 的大小所属的范围, 来对应视频的时间
 * @param pageX {number} 偏移量
 * @return {number} 返回视频时间
 */
function judgePageXRangeToCalcVideoTime(pageX) {
    let videoTime;
    let {minOffsetX, maxOffsetX, getVideoTimeByOffsetX} = progressInfo;
    if (pageX < minOffsetX) {
        videoTime = 0;
    } else if (pageX > maxOffsetX) {
        videoTime = videoDuration;
    } else {
        videoTime = getVideoTimeByOffsetX(pageX);
    }
    return videoTime;
}

function mousedownProgressContainer(e) {
    updateProgressing = true;
    let clickPageX = e.pageX;
    let mousemove = false;
    let {getVideoTimeByOffsetX} = progressInfo;
    let movePageX;

    let mousemoveInViewport = (e) => {
        mousemove = true;
        movePageX = e.pageX;
        window.updateCurrentProgress(getVideoTimeByOffsetX(movePageX));
    };

    let mouseupInViewPart = () => {
        removeEvent();
        window.flushBarrage();
        let currentTime;
        // 如果鼠标移动, 使用 movePageX, 否则使用 clickPageX
        if (mousemove) {
            currentTime = window.judgePageXRangeToCalcVideoTime(movePageX);
        } else {
            currentTime = getVideoTimeByOffsetX(clickPageX);
        }
        window.updateVideoCurrentTime(currentTime);
        updateProgressing = false;
    };

    let removeEvent = () => {
        window.removeEventListener("mousemove", mousemoveInViewport);
        window.removeEventListener("mouseup", mouseupInViewPart);
    };

    window.addEventListener("mousemove", mousemoveInViewport);
    window.addEventListener("mouseup", mouseupInViewPart);
}

/**
 * 将视频渲染到 canvas 中, 然后通过 toDataURL 将其转化为 BASE64 编码, 最后将编码
 * 设置为 img 的 src 属性, 从而实现视频帧的显示
 * @param videoTime {number} 视频时间, 秒数
 */
function renderVideoFrame(videoTime) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    videoTime = Math.floor(videoTime);
    videoCopy.currentTime = videoTime;

    // 播放视频才能够获取到帧
    videoCopy.play().then(() => {
        ctx.drawImage(videoCopy, 0, 0, canvas.width * devicePixelRatio, canvas.height * devicePixelRatio);
        videoCopy.pause();
        videoFrameView.src = canvas.toDataURL("image/jpeg");
        videoFrameView.clientHeight;
    });
}

/**
 * 更新视频帧预览的时间
 * @param currentTime {number} 视频秒数
 */
function updateVideoPreviewTimeValue(currentTime) {
    videoPreviewTime.innerText = window.formatToMinuteSecondTime(currentTime);
}

/**
 * 在进度条中移动鼠标, 实时预览视频帧
 * @param e {MouseEvent} 事件对象
 */
function mousemoveInVideoProgress(e) {
    if (!videoFrameViewVisible) return;
    let pageX = e.pageX;
    let currentTime = window.judgePageXRangeToCalcVideoTime(pageX);

    window.updateVideoPreviewTimeValue(currentTime);
    window.updateVideoFrameTranslateX(pageX);

    // 添加到任务队列, 这里使用任务队列是经过严密考量和实践的:
    // 1. 如果不对视频帧的渲染加以控制, 由于鼠标移动事件触发频率过高, 画面会出现卡顿, 从用户体验角度来看需要加以限流.
    // 2. 如果简单使用限流或者防抖, 由于防抖和节流都会丢弃最新添加的任务, 导致最新的视频帧无法得到渲染, 所以这种方法淘汰.
    // 3. 最后经过上述思考之后, 决定采用任务队列, 该队列会在任务满时丢弃最早添加的任务来容纳最新的任务, 这样就能保证最新的视频帧的渲染.
    taskQueue.addTask(() => {
        window.requestAnimationFrame(() => {
            window.renderVideoFrame(currentTime);
        });
    });
}

/**
 * 更新 progressInfo 和 videoFrameInfo 的内容
 */
function updateProgressAndFrameInfo() {
    let progressContainerWidth;
    let progressContainerLeft;
    let progressContainerRect = videoProgressContainer.getBoundingClientRect();
    let progressInfoHasChanged = (progressContainerRect.width !== progressInfo?.progressContainerWidth) ||
        (progressContainerRect.left !== progressInfo?.progressContainerLeft);

    // 数据是否更改
    if (progressInfoHasChanged) {
        progressContainerLeft = progressContainerRect.left;
        progressContainerWidth = progressContainerRect.width;
        let minOffsetX = progressContainerLeft;
        let maxOffsetX = progressContainerLeft + progressContainerWidth;

        // 根据偏移量获取视频时间
        let getVideoTimeByOffsetX = function (offsetX) {
            if(offsetX < minOffsetX) {
                offsetX = minOffsetX;
            } else if (offsetX > maxOffsetX) {
                offsetX = maxOffsetX;
            }
            return Math.floor((offsetX - minOffsetX) / progressContainerWidth * videoDuration);
        };

        progressInfo = {
            videoFramePreviewWidth: 0,
            progressContainerWidth,
            progressContainerLeft,
            minOffsetX,
            maxOffsetX,
            getVideoTimeByOffsetX,
        };

        // 为了使得 getBoundingClientRect 获取到内容
        videoFramePreview.style.opacity = "0";
        videoFramePreview.show();

        let videoFramePreviewWidth;
        let videoFramePreviewRect = videoFramePreview.getBoundingClientRect();
        progressInfo.videoFramePreviewWidth = videoFramePreviewWidth = videoFramePreviewRect.width;

        videoFramePreview.style.opacity = "";
        videoFramePreview.hide();

        videoFramePreviewInfo = {
            minOffsetX: minOffsetX + (videoFramePreviewWidth >> 1),
            maxOffsetX: maxOffsetX - videoFramePreviewWidth,
        };
    }
}

function mouseenterVideoProgressBar(e) {
    let pageX = e.pageX;

    window.updateProgressAndFrameInfo();

    // 需要鼠标悬停一秒才显示视频预览
    timer = setTimeout(() => {
        videoFrameViewVisible = true;
        videoFramePreview.show();

        let videoTime = window.judgePageXRangeToCalcVideoTime(pageX);
        window.updateVideoPreviewTimeValue(videoTime);
        window.renderVideoFrame(videoTime);
        window.updateVideoFrameTranslateX(pageX);
    }, 1000);
}

function mouseleaveVideoProgressBar() {
    videoFrameViewVisible = false;
    window.clearTimeout(timer);
    videoFramePreview.hide();
}

function keyupToSkipInterval(e) {
    switch (e.code) {
        // 快退
        case arrowLeftCode:
            window.updateVideoCurrentTime(video.currentTime - intervalOfSkip);
            break;
        // 快进
        case arrowRightCode:
            window.updateVideoCurrentTime(video.currentTime + intervalOfSkip);
            break;
        default:
            break;
    }
}

function videoProgressInit() {
    // 创建一个隐藏的 video
    videoCopy = document.createElement("video");
    // 获取视频的路径, 由于 html 采用 resource 标签的方式引入, 所以获取方式如下
    videoCopy.src = video.children[0].src;
    videoCopy.muted = true;

    taskQueue = window.buildTaskQueue(2);

    // 控件显示和隐藏时也对应着 shadowProgressBox 的隐藏和显示
    showControlsCallbackArr.push(shadowProgressBox.hide);
    hideControlsCallbackArr.push(shadowProgressBox.show);
    // videoBox 改变尺寸需要修改参数数据
    videoBoxResizeCallbackArr.push(window.updateProgressAndFrameInfo);
}


videoProgressInit();

window.addKeyupHandler(arrowLeftCode, window.keyupToSkipInterval);
window.addKeyupHandler(arrowRightCode, window.keyupToSkipInterval);
video.addEventListener("timeupdate", updateCurrentProgressHandler);
video.addEventListener("progress", updateBufferProgressHandler);
videoProgressContainer.addEventListener("mousedown", window.mousedownProgressContainer);
videoProgressContainer.addEventListener("mouseenter", window.mouseenterVideoProgressBar);
videoProgressContainer.addEventListener("mouseleave", window.mouseleaveVideoProgressBar);
videoProgressContainer.addEventListener("mousemove", window.mousemoveInVideoProgress);
