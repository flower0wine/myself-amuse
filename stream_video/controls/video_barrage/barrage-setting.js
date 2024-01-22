/**
 * 功能描述：
 * 创建日期：2024 年 01 月 04 日
 */

// 使用严格模式
'use strict';

const notSelectBold = "not-select-bold";
const fontFamilyArr = ["微软雅黑", "黑体", "宋体", "仿宋", "楷体", "Arial", "Tahoma", "Verdana", "Times New Roman", "Georgia", "Courier New", "Impact", "Comic Sans MS"];

let barrageSettingBoardVisible = false;
let barrageSettingFirstShow = true;

/**
 * 下面的以 computed 开头的属性是根据 video_barrage 目录下的 index.js 中的属性来确定的, 为的是可维护性
 */
const computedMinBarrageOpacity = barrageMinOpacity * 100;
const computedMaxBarrageOpacity = barrageOpacityBase * 100 - computedMinBarrageOpacity;
const computedMinBarrageFontSizeRatio = barrageFontSizeMinRatio * 100;
const computedMaxBarrageFontSizeRatio = barrageFontSizeMaxRatio * 100 - computedMinBarrageFontSizeRatio;
const computedMinBarrageRollSpeed = barrageRollSpeedBase;
const computedMaxBarrageRollSpeed = barrageRollMaxSpeed - computedMinBarrageRollSpeed;
const computedMinBarrageAreaRatio = barrageAreaMinRatio;
const computedMaxBarrageAreaRatio = barrageAreaMaxRatio - computedMinBarrageAreaRatio;

const barrageSettingBoard = document.querySelector(".barrage-setting-board");
const barrageSettingContainer = document.querySelector(".barrage-setting-container");
const fontFamilyContainer = document.querySelector(".font-family-container");
const barrageFontFamilyList = document.querySelector(".barrage-font-family-list");
const barrageFontFamilyItem = document.querySelector(".barrage-font-family-item");
const barrageBoldContainer = document.querySelector(".barrage-bold-container");
const selectedFontFamily = document.querySelector(".selected-font-family");
const opacityTool = document.querySelector(".opacity-tool");
const fontSizeTool = document.querySelector(".font-size-tool");
const areaTool = document.querySelector(".area-tool");
const speedTool = document.querySelector(".speed-tool");

/**
 * 对比例进行转换
 * @param ratio {number} 比例, 范围为 0 - 100
 * @return {number} 返回转换后的比例
 */
function transformBarrageOpacityRatio(ratio) {
    return computedMinBarrageOpacity + Math.floor(computedMaxBarrageOpacity * ratio / 100);
}

/**
 * 设置弹幕透明度
 * @param ratio {number} 比例, 范围为 0 - 100
 */
function updateBarrageOpacity(ratio) {
    window.setBarrageOpacity(barrageOpacityBase * window.transformBarrageOpacityRatio(ratio) / 100);
}

/**
 * 更新弹幕透明度文本
 * @param ratio {number} 比例, 范围为 0 - 100
 * @param valueElement {HTMLElement} 展示文本的元素
 */
function updateBarrageOpacityText(ratio, valueElement) {
    valueElement.innerText = `${window.transformBarrageOpacityRatio(ratio)}%`;
}

/**
 * 对比例范围进行调整
 * @param ratio {number} 比例, 范围为 0 - 100
 * @return {number} 返回转换后的比例
 */
function transformBarrageFontSizeRatio(ratio) {
    return computedMinBarrageFontSizeRatio + Math.floor(computedMaxBarrageFontSizeRatio * ratio / 100);
}

/**
 * 设置弹幕字体大小
 * @param ratio {number} 比例,  范围为 0 - 100
 */
function updateBarrageFontSize(ratio) {
    window.setBarrageFontSize(Math.floor(barrageFontSizeBase * (window.transformBarrageFontSizeRatio(ratio) / 100)));
}

/**
 * 更新弹幕透明度文本
 * @param ratio {number} 比例, 范围为 0 - 100
 * @param valueElement {HTMLElement} 展示比例的元素
 */
function updateBarrageFontSizeText(ratio, valueElement) {
    valueElement.innerText = `${window.transformBarrageFontSizeRatio(ratio)}%`;
}

/**
 * 设置弹幕展示区域
 * @param ratio {number} 比例, 范围为 0 - 100
 */
function updateBarrageAreaRatio(ratio) {
    window.setBarrageAreaRatio(computedMinBarrageAreaRatio + (computedMaxBarrageAreaRatio * ratio / 100));
}

/**
 * 设置弹幕速度
 * @param ratio {number} 比例, 范围为 0 - 100
 */
function updateBarrageSpeed(ratio) {
    window.setBarrageSpeed(computedMinBarrageRollSpeed + Math.floor(computedMaxBarrageRollSpeed * ratio / 100));
}

/**
 * 展示弹幕设置面板
 */
function showBarrageSettingBoard() {
    barrageSettingBoardVisible = true;

    // 如果是第一次显示，则需要初始化一些数据
    if (barrageSettingFirstShow) {
        barrageSettingFirstShow = false;

        window.barrageFontFamilyListInitial();

        let areaToolProgressOptions = window.stepProgress(areaTool);
        areaToolProgressOptions.updateProgressCallback = window.updateBarrageAreaRatio;

        let speedToolProgressOptions = window.stepProgress(speedTool);
        speedToolProgressOptions.updateProgressCallback = window.updateBarrageSpeed;

        let opacityToolProgressOptions = window.dragProgress(opacityTool);
        opacityToolProgressOptions.updateProgressText = window.updateBarrageOpacityText;
        opacityToolProgressOptions.updateProgressCallback = window.updateBarrageOpacity;

        let fontSizeToolProgressOptions = window.dragProgress(fontSizeTool);
        fontSizeToolProgressOptions.updateProgressText = window.updateBarrageFontSizeText;
        fontSizeToolProgressOptions.updateProgressCallback = window.updateBarrageFontSize;
    }

    window.fadeIn(barrageSettingBoard, VIDEO_CONTROL_DURATION, barrageSettingContainer).then(() => {
    });
}

function hideBarrageSettingBoard() {
    window.fadeOut(barrageSettingBoard, VIDEO_CONTROL_DURATION, barrageSettingContainer).then(() => {
        barrageSettingBoardVisible = false;
    });
}

/**
 * 显示弹幕字体列表
 */
function showBarrageFontFamilyList() {
    barrageFontFamilyList.classList.add(SHOW_CLASS_NAME);
}

/**
 * 隐藏弹幕字体列表
 */
function hideBarrageFontFamilyList() {
    barrageFontFamilyList.classList.remove(SHOW_CLASS_NAME);
}

function changeBarrageBold() {
    window.setBarrageBold(!window.getBarrageBold());
    barrageBoldContainer.classList.toggle(notSelectBold);
}

/**
 * 初始化弹幕字体列表
 */
function barrageFontFamilyListInitial() {
    window.setBarrageFontFamily(fontFamilyArr[0]);

    let fragment = document.createDocumentFragment();
    barrageFontFamilyItem.remove();

    selectedFontFamily.innerText = window.getBarrageFontFamily();
    fontFamilyArr.forEach((fontFamily) => {
        let itemClone = barrageFontFamilyItem.cloneNode(true);
        itemClone.innerText = fontFamily;
        itemClone.style.fontFamily = fontFamily;
        itemClone.onclick = () => {
            barrageFontFamily = fontFamily;
            selectedFontFamily.innerText = fontFamily;
            window.hideBarrageFontFamilyList();
        };
        fragment.appendChild(itemClone);
    });
    barrageFontFamilyList.appendChild(fragment);

    fontFamilyContainer.addEventListener("mouseenter", window.showBarrageFontFamilyList);
    fontFamilyContainer.addEventListener("mouseleave", window.hideBarrageFontFamilyList);
}

barrageBoldContainer.addEventListener("click", window.changeBarrageBold);
barrageSettingContainer.addEventListener("mouseenter", window.showBarrageSettingBoard);
barrageSettingContainer.addEventListener("mouseleave", window.hideBarrageSettingBoard);