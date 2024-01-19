/**
 * 功能描述：
 * 创建日期：2024 年 01 月 07 日
 */

// 使用严格模式
'use strict';

let barragePositionWillSend = BARRAGE_POSITION.roll;

const barrageMaxLength = 60;
const exceedLimitClassName = "exceed-limit";

const barrageInput = document.querySelector("#barrage-input");
const barrageSendBtn = document.querySelector(".send-btn");
const barrageNumberCount = document.querySelector(".word-number");
const barrageSendContainer = document.querySelector(".barrage-send-container");

/**
 * 设置弹幕已输入的字数
 * @param wordNumber {number} 字数
 */
function setBarrageNumberCount(wordNumber) {
    barrageNumberCount.innerText = `${wordNumber} / ${barrageMaxLength}`;
}

/**
 * 设置将要发送的弹幕位置
 * @param position {number} 弹幕位置
 */
function setBarragePositionWillSend(position) {
    barragePositionWillSend = position;
}

/**
 * 发送弹幕
 */
function sendBarrage() {
    let value = barrageInput.value;
    if(!value) {
        barrageInput.focus();
        return;
    }
    window.addBarrageToBarrageArr({
        me: true,
        text: value.slice(0, barrageMaxLength),
        color: window.getBarrageFontColor(),
        bold: window.getBarrageBold(),
        [barragePositionPropertyName]: barragePositionWillSend,
    });
    barrageInput.value = "";
    window.setBarrageNumberCount(0);
}

function barrageInputFocusHandler() {
    window.disableKeyboardShortcutKeys();
}

function barrageInputBlurHandler() {
    window.ableKeyboardShortcutKeys();
}

/**
 * 在弹幕输入框触发 input 事件
 */
function barrageInputTyingHandler() {
    let value = barrageInput.value;
    let wordNumber = value.length;
    window.setBarrageNumberCount(wordNumber);
    if(wordNumber > barrageMaxLength) {
        barrageSendContainer.classList.add(exceedLimitClassName);
    } else {
        barrageSendContainer.classList.remove(exceedLimitClassName);
    }
}

function barrageInputInitial() {
    barrageInput.maxLength = barrageMaxLength;
    window.setBarrageNumberCount(0);
}

window.barrageInputInitial();

barrageInput.addEventListener("focus", window.barrageInputFocusHandler);
barrageInput.addEventListener("paste", window.barrageInputTyingHandler);
barrageInput.addEventListener("blur", window.barrageInputBlurHandler);
barrageInput.addEventListener("input", window.barrageInputTyingHandler);
barrageSendBtn.addEventListener("click", window.sendBarrage);
