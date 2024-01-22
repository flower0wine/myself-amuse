/**
 * 功能描述：
 * 创建日期：2024 年 01 月 04 日
 */

// 使用严格模式
'use strict';

let colorSelectorPixelInfo;
let fontToolBoardFirstShow = true;
let fontToolsBoardVisible = false;
let colorRadixReg = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const positionTypePropertyName = "positionType";

const fontToolsBoard = document.querySelector('.font-tools-board');
const barrageColorSelector = document.querySelector('#barrage-color-selector');
const fontToolsContainer = document.querySelector('.font-tools-container');
const colorInput = document.querySelector('#color-input');
const usingColor = document.querySelector('.using-color');
const barragePositionItemList = document.querySelectorAll('.barrage-position-item');

const colorSelectorCanvas = barrageColorSelector.getContext('2d');
const barrageColorSelectorScale = barrageColorSelector.width;
const barrageColorSelectorRadius = barrageColorSelectorScale >> 1;

// 这是本地测试用的颜色, 如果连接服务器需要进行更改
const initialBarrageColor = "#FFFFFF";

/**
 * 要发送的弹幕的字体颜色, 这里使用使用 Proxy 对源对象的设置进行限制
 * @type {{value: string}}
 */
let colorInputValue = new Proxy({
    value: initialBarrageColor,
}, {
    get(target, property) {
        return Reflect.get(target, property);
    },
    set(target, property, value) {
        // 如果是输入框输入, 会再对输入框的内容赋值
        colorInput.value = value;
        return Reflect.set(target, property, value);
    }
});

function getBarrageFontColor() {
    return colorInputValue.value;
}

/**
 * 清空整个画布
 */
function clearCanvas() {
    colorSelectorCanvas.clearRect(0, 0, barrageColorSelectorScale, barrageColorSelectorScale);
}

/**
 * 画颜色选择器, 使用锥形渐变 canvas.createConicGradient(开始角度, 宽度, 高度) 来创建区域. <br>
 * 使用 conicGradient.addColorStop(比例, 颜色) 来添加颜色.
 */
function drawColorSelectorBoard() {
    let ctx = colorSelectorCanvas;
    let radius = barrageColorSelectorRadius;
    let scale = barrageColorSelectorScale;

    ctx.save();

    if (ctx.createConicGradient && usingBrowserType !== browserType.fireBox) {
        // 创建锥形渐变颜色
        let conicGradient = ctx.createConicGradient(0, radius, radius);

        for (let angle = 0; angle < 360; angle += 30) {
            let color = `hsl(${angle}, 100%, 50%)`;
            conicGradient.addColorStop(angle / 360, color);
        }
        // 填充颜色为锥形渐变颜色
        ctx.fillStyle = conicGradient;
        ctx.fillRect(0, 0, scale, scale);
    } else {
        // 绘制色环
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * (Math.PI / 180);
            const endAngle = angle * (Math.PI / 180);
            const color = `hsl(${angle}, 100%, 50%)`;

            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, startAngle, endAngle);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }
    ctx.restore();
}

/**
 * 画选择颜色的按钮
 * @param mouseX {number} 横坐标
 * @param mouseY {number} 纵坐标
 */
function drawMoveButton(mouseX, mouseY) {
    let ctx = colorSelectorCanvas;
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#c5c5c5';
    ctx.fillStyle = '#ffffff';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function showFontToolsBoard() {
    fontToolsBoardVisible = true;

    if (fontToolBoardFirstShow) {
        fontToolBoardFirstShow = false;
        window.initialFontTool();
    }
    window.fadeIn(fontToolsBoard, VIDEO_CONTROL_DURATION, fontToolsContainer).then(() => {
    });
}

function hideFontToolsBoard() {
    window.fadeOut(fontToolsBoard, VIDEO_CONTROL_DURATION, fontToolsContainer).then(() => {
        fontToolsBoardVisible = false;
    });
}

/**
 * 改变要发送弹幕的位置的初始化函数
 */
function changeBarragePositionInitial() {
    barragePositionItemList.forEach((item) => {
        let classList = item.classList;
        // 弹幕位置初始化, 这里为了尽量避免硬编码, 提高可维护性, 所以遍历匹配
        classList.forEach((clazz) => {
            for (let key in BARRAGE_POSITION) {
                if (clazz.startsWith(key)) {
                    item.dataset[positionTypePropertyName] = BARRAGE_POSITION[key];
                }
            }
        });

        // 点击改变要发送的弹幕的位置
        item.addEventListener("click", () => {
            window.setBarragePositionWillSend(+item.dataset[positionTypePropertyName]);
            barragePositionItemList.forEach((item) => {
                item.classList.remove(ACTIVE_CLASS_NAME);
            });
            item.classList.add(ACTIVE_CLASS_NAME);
        });
    });
}

/**
 * 根据坐标更新正在使用的颜色
 * @param x {number} 横坐标
 * @param y {number} 纵坐标
 */
function updateUsingColorByCoordinate(x, y) {
    let index = (y * barrageColorSelectorScale + x) * 4;
    let pixelData = colorSelectorPixelInfo.data;
    let r = pixelData[index];
    let g = pixelData[index + 1];
    let b = pixelData[index + 2];
    let a = pixelData[index + 3];
    usingColor.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    let radixConversion = (number) => {
        return window.radixConversion(number, 16, 2).toUpperCase();
    };
    let color = `${radixConversion(r)}${radixConversion(g)}${radixConversion(b)}`;
    window.updateColorInputValue(color);
}

/**
 * 更新颜色输入框的内容, 即颜色的十六进制表示
 * @param color {string} 颜色的十六进制表示. 如 ffffff
 */
function updateColorInputValue(color) {
    colorInputValue.value = `#${color}`;
}

/**
 * 鼠标在颜色选择器区域内按下时执行的函数
 * @param mousedownEvent {MouseEvent} 事件对象
 */
function mousedownInColorSelector(mousedownEvent) {
    let scale = barrageColorSelectorScale;
    let mousedownX = getOffsetByTranslateCoordinateSystem(mousedownEvent.offsetX);
    let mousedownY = getOffsetByTranslateCoordinateSystem(mousedownEvent.offsetY);
    let mousemove = false;

    // 在计算层面将颜色选择器移至坐标系原点
    function getOffsetByTranslateCoordinateSystem(offset) {
        return offset - scale;
    }

    // 重绘颜色选择器, 并执行相关的操作
    let redraw = (x, y) => {
        window.clearCanvas();
        window.drawColorSelectorBoard();
        window.drawMoveButton(x, y);
        window.updateUsingColorByCoordinate(x, y);
    };
    // 获取当前坐标与圆心的距离
    let getDistanceWithCircleCenter = (x, y) => {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
    let mousemoveHandler = (mousemoveEvent) => {
        mousemove = true;
        let mousemoveX = getOffsetByTranslateCoordinateSystem(mousemoveEvent.offsetX);
        let mousemoveY = getOffsetByTranslateCoordinateSystem(mousemoveEvent.offsetY);
        let distanceWithCircleCenter = getDistanceWithCircleCenter(mousemoveX, mousemoveY);
        if (distanceWithCircleCenter <= scale) {
            redraw(mousemoveEvent.offsetX, mousemoveEvent.offsetY);
        }
    };
    let endHandler = () => {
        removeEvent();
        if (!mousemove) {
            let distanceWithCircleCenter = getDistanceWithCircleCenter(mousedownX, mousedownY);
            if (distanceWithCircleCenter <= scale) {
                redraw(mousedownEvent.offsetX, mousedownEvent.offsetY);
            }
        }
    };
    let removeEvent = () => {
        barrageColorSelector.removeEventListener("mousemove", mousemoveHandler);
        barrageColorSelector.removeEventListener("mouseup", endHandler);
    };

    barrageColorSelector.addEventListener("mousemove", mousemoveHandler);
    barrageColorSelector.addEventListener("mouseup", endHandler);
}

function initialFontTool() {
    let ctx = colorSelectorCanvas;
    let scale = barrageColorSelectorScale;
    let radius = barrageColorSelectorRadius;

    window.changeBarragePositionInitial();

    // 切割 canvas 为圆形
    let path = new Path2D();
    path.arc(radius, radius, radius, 0, 2 * Math.PI, false);
    ctx.clip(path, "nonzero");

    window.clearCanvas();
    window.drawColorSelectorBoard();

    // 由于色板像素不变, 所以直接获取, 后面使用这个时候的像素信息即可
    colorSelectorPixelInfo = ctx.getImageData(0, 0, scale, scale);

    window.drawMoveButton(radius, radius);
}

/**
 * 在输入框填写颜色十六进制
 * @param e {KeyboardEvent} 事件对象
 */
function colorInputTyping(e) {
    e.preventDefault();
    let value = colorInput.value;
    if (colorRadixReg.test(value)) {
        colorInputValue.value = value;
        usingColor.style.backgroundColor = value;
    }
}

function colorInputFocusHandler() {
    window.disableKeyboardShortcutKeys();
}

function colorInputBlurHandler() {
    window.ableKeyboardShortcutKeys();
}

colorInput.addEventListener("input", window.colorInputTyping);
colorInput.addEventListener("focus", window.colorInputFocusHandler);
colorInput.addEventListener("blur", window.colorInputBlurHandler);
barrageColorSelector.addEventListener("mousedown", window.mousedownInColorSelector);
fontToolsContainer.addEventListener("mouseenter", window.showFontToolsBoard);
fontToolsContainer.addEventListener("mouseleave", window.hideFontToolsBoard);
