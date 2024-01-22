/**
 * 功能描述：
 * 创建日期：2024 年 01 月 05 日
 */

// 使用严格模式
'use strict';

const progressValueElementClassName = ".progress-value";
const stepModeClassName = "step-mode";

/**
 * 查询必要的 DOM 元素
 * @param container {HTMLElement} 进度条所在的父元素
 * @param valueElement {HTMLElement} 展示进度文字元素
 * @return {{valueElement: HTMLElement, progressContainer: HTMLElement, innerTrack: HTMLElement, moveArea: HTMLElement}}
 * 返回一个对象, 其中的属性如下 <br>
 * 1. valueElement: 展示进度的元素, 如果未指定就使用 progressValueElementClassName 查询到的元素
 * 2. progressContainer: 进度条容器
 * 3. innerTrack: 内轨元素
 * 5. moveArea: 鼠标可移动区域
 */
function queryProgressDOM(container, valueElement) {
    let doms = {};
    doms.valueElement = valueElement ?? container.querySelector(progressValueElementClassName);
    doms.progressContainer = container.querySelector(".progress-container");
    doms.innerTrack = doms.progressContainer.querySelector(".progress-inner-track");
    doms.moveArea = doms.progressContainer.querySelector(".progress-move-area");
    return doms;
}

/**
 * 更新内轨元素宽度
 * @param widthRatio {number} 宽度百分比
 * @param innerTrack {HTMLElement} 内轨元素
 */
function updateProgressInnerTrackWidth(widthRatio, innerTrack) {
    innerTrack.style.width = `${widthRatio}%`;
}

function updateProgressWidthRatioValue(widthRatio, valueElement) {
    valueElement.innerHTML = `${Math.floor(widthRatio)}%`;
}

/**
 * 更新 valueElement 的内容, 这里是设置分段值
 * @param stepValue {number} 分段值
 * @param valueElement {HTMLElement} 要填充内容的元素
 */
function updateProgressStepValue(stepValue, valueElement) {
    valueElement.innerHTML = `${stepValue}`;
}

/**
 * 进度配置对象的通用配置
 * @param option {Object} 源对象
 * @param propertyMap {Map<string, function>} 属性对象, 内部对外部的限制
 * @return {{optionProxy: DragProgressOptions}}
 */
function configureProgressOptions(option, propertyMap) {
    // 为外部使用代理对象进行限制
    let optionProxy = new Proxy(option, {
        defineProperty() {
            console.error("不允许添加属性");
            return false;
        },
        deleteProperty() {
            console.error("不允许删除属性");
            return false;
        },
        set(target, property, value) {
            let fn = propertyMap.get(property);
            if (!fn || !fn(value)) {
                console.error(`提供的属性名: ${property} 未定义或者赋值类型不准确。`);
                return true;
            }
            return Reflect.set(target, property, value);
        }
    });

    return {
        optionProxy,
    }
}

/**
 * @typedef {Object} DragProgressOptions
 * @property {boolean} progressUpdating - 如果为 true，表示正在设置进度中；反之未设置进度，在设置进度时只会更新样式和相关的文字
 * @property {boolean} [leaveCanContinue=false] - 离开可拖动区域是否仍然可以改变进度，默认值为 false
 * @property {function(number, HTMLElement)} [updateProgressText] <br/> 1. 这个函数可以由你提供，用来定义展示进度文本的格式 <br/> 2. 在拖动过程中持续调用, 该函数会接收到两个参数(ratio, valueElement)，第一个参数为比例，默认范围为 0-100，第二个参数为展示进度文字的元素 <br/> 3. 默认进度文本使用百分比，例如 50%
 * @property {function(number)} [updateProgressCallback] - 更新进度后的回调，该函数与 updateProgressValue 的区别是 updateProgressCallback 会在鼠标弹起后执行，即执行一次
 */

/**
 * 1. 获取 option 配置的副本 <br>
 * 2. 如果 option 发生变化, 会对 optionsExport 指定的属性进行更新 <br>
 * 3. 如果 optionsExport 发生变化, 会对 option 指定的属性进行更新
 * @returns {{option: DragProgressOptions, optionProxy: DragProgressOptions}}
 */
function configureDragProgressOptions() {
    let option = {
        progressUpdating: false,
        leaveCanContinue: false,
        /**
         * @type {function(number, HTMLElement)}
         */
        updateProgressText: null,
        /**
         * @type {function(number)}
         */
        updateProgressCallback: null
    };

    let propertyMap = new Map();

    // 对外部的修改进行限制
    propertyMap.set("progressUpdating", () => {
        console.error(`progressUpdating 为只读属性, 给其赋值会被忽略`);
        return false;
    });
    propertyMap.set("leaveCanContinue", (value) => {
        if (!(typeof value === "boolean")) {
            console.error(`提供的 leaveCanContinue: ${value} 不为布尔值, 赋值失败`);
            return false;
        }
        return true;
    });
    propertyMap.set("updateProgressText", (value) => {
        if (!(typeof value === "function")) {
            console.error(`提供的 updateProgressValue: ${value} 不为函数, 赋值失败`);
            return false;
        }
        return true;
    });
    propertyMap.set("updateProgressCallback", (value) => {
        if (!(typeof value === "function")) {
            console.error(`提供的 updateProgressCallback: ${value} 不为函数, 赋值失败`);
            return false;
        }
        return true;
    });

    let {optionProxy} = window.configureProgressOptions(option, propertyMap);

    return {
        option,
        optionProxy,
    }
}

/**
 * 拖动进度条
 * @param container {HTMLElement} 进度条所在的父元素
 * @param {HTMLElement} [valueElement] 展示进度文字的元素, 如果不传值, 将查找类名为 progress-value 的元素
 * @return {DragProgressOptions}
 * 返回一个 DragProgressOptions 配置对象, 可以更改
 */
function dragProgress(container, valueElement) {
    let doms = window.queryProgressDOM(container, valueElement);
    let {innerTrack, moveArea} = doms;

    let {option: progressOptions, optionProxy: progressOptionsExport} = window.configureDragProgressOptions();

    let mousedownHandler = (clickEvent) => {
        progressOptions.progressUpdating = true;
        let mousemove = false;
        let mousedownX = clickEvent.pageX;
        let moveAreaWidth = moveArea.getBoundingClientRect().width;
        let moveAreaLeft = moveArea.getBoundingClientRect().left;
        let minOffsetX = moveAreaLeft;
        let maxOffsetX = moveAreaLeft + moveAreaWidth;
        let mousemoveX;
        let widthRatio;

        if (!moveAreaWidth) return;

        // 获取进度条的宽度百分比
        let getWidthRatio = (x) => {
            if (x <= minOffsetX) {
                return 0;
            } else if (x >= maxOffsetX) {
                return 100;
            }
            return (x - minOffsetX) / moveAreaWidth * 100;
        };

        // 更新进度
        let updateProgress = (x) => {
            widthRatio = getWidthRatio(x);
            window.updateProgressInnerTrackWidth(widthRatio, innerTrack);
            if (!!progressOptions.updateProgressText) {
                progressOptions.updateProgressText(widthRatio, doms.valueElement);
            } else {
                window.updateProgressWidthRatioValue(widthRatio, doms.valueElement);
            }
        };

        // 鼠标移动时持续更新进度
        let mousemoveHandler = (mousemoveEvent) => {
            mousemove = true;
            mousemoveX = mousemoveEvent.pageX;
            updateProgress(mousemoveX);
        };

        let removeEvent = () => {
            window.removeEventListener("mousemove", mousemoveHandler);
            window.removeEventListener("mouseup", endHandler);
            if (progressOptions.leaveCanContinue) {
                moveArea.removeEventListener("mouseleave", endHandler);
            }
            progressOptions.progressUpdating = false;
        };

        // 结束处理, 包括鼠标离开和鼠标按键弹起
        let endHandler = (e) => {
            e.stopPropagation();
            removeEvent();
            if (!mousemove) {
                updateProgress(mousedownX);
            }
            progressOptions.updateProgressCallback && progressOptions.updateProgressCallback(widthRatio);
        }
        if (progressOptions.leaveCanContinue) {
            moveArea.addEventListener("mouseleave", endHandler);
        }

        window.addEventListener("mousemove", mousemoveHandler);
        window.addEventListener("mouseup", endHandler);
    };

    moveArea.addEventListener("mousedown", mousedownHandler);
    return progressOptionsExport;
}


/**
 * @typedef {Object} StepProgressOptions
 * @property {function(number)} [updateProgressCallback] - 更新进度后的回调，会在鼠标点击一项后执行
 */

/**
 * 1. 获取 option 配置的副本 <br>
 * 2. 如果 option 发生变化, 会对 optionsExport 指定的属性进行更新 <br>
 * 3. 如果 optionsExport 发生变化, 会对 option 指定的属性进行更新
 * @returns {{option: {updateProgressCallback: function(number)}, optionProxy: StepProgressOptions}}
 */
function configureStepProgressOptions() {
    let option = {
        /**
         * @type {function(number)}
         */
        updateProgressCallback: null
    };

    let propertyMap = new Map();

    // 对外部的修改进行限制
    propertyMap.set("updateProgressCallback", (value) => {
        if (!(typeof value === "function")) {
            console.error(`提供的 updateProgressCallback: ${value} 不为函数, 赋值失败`);
            return false;
        }
        return true;
    });

    let {optionProxy} = window.configureProgressOptions(option, propertyMap);

    return {
        option,
        optionProxy,
    }
}

/**
 * 分段进度条样式
 * @param container {HTMLElement} 进度条所在的父元素
 * @param {HTMLElement} [valueElement] 展示进度文字的元素, 如果不传值, 将查找类名为 progress-value 的元素
 * @return {StepProgressOptions}
 */
function stepProgress(container, valueElement) {
    let doms = window.queryProgressDOM(container, valueElement);
    let {progressContainer, moveArea, innerTrack} = doms;
    if (!progressContainer.classList.contains(stepModeClassName)) {
        progressContainer.classList.add(stepModeClassName);
    }

    let {option: progressOptions, optionProxy: progressOptionsExport} = window.configureStepProgressOptions();

    // 查询相关的 DOM
    let progressStep = container.querySelector(".progress-step");
    let progressStepItem = progressStep.querySelectorAll(".progress-item");

    // 进度分段初始化是否完成
    let progressStepInitialized = false;
    let progressStepInfoArr = [];
    let itemPoint = [];

    let progressStepInitialHandler = () => {
        // 获取有关的分段信息
        for (let index = 0, length = progressStepItem.length; index < length; index++) {
            let progressStepItemDom = progressStepItem[index];
            let progressText = progressStepItemDom.querySelector(".progress-text");
            progressStepInfoArr.push({
                left: progressStepItemDom.style.left.split("%")[0],
                text: progressText.innerHTML,
            });
        }

        // 对可拖动区域进行分段
        let segmentationCount = progressStepInfoArr.length - 1;
        let moveAreaWidth = moveArea.getBoundingClientRect().width;
        let unitWidth = moveAreaWidth / (segmentationCount << 1);
        let twoUnitWidth = unitWidth << 1;

        itemPoint.push(unitWidth);
        for (let index = 1, length = segmentationCount; index < length; index++) {
            itemPoint.push(itemPoint[index - 1] + twoUnitWidth);
        }
    };

    let clickHandler = function (event) {
        if (!progressStepInitialized) {
            progressStepInitialized = true;
            progressStepInitialHandler();
            progressStepInitialHandler = null;
        }

        let clickX = event.offsetX;
        if (!clickX) return;

        let matchedStepInfo;
        for (let index = itemPoint.length - 1; index >= 0; index--) {
            if (clickX >= itemPoint[index]) {
                matchedStepInfo = progressStepInfoArr[index + 1];
                break;
            } else if (index === 0 && clickX < itemPoint[index]) {
                matchedStepInfo = progressStepInfoArr[index];
                break;
            }
        }

        window.updateProgressInnerTrackWidth(matchedStepInfo.left, innerTrack);
        window.updateProgressStepValue(matchedStepInfo.text, doms.valueElement);
        progressOptions.updateProgressCallback && progressOptions.updateProgressCallback(+matchedStepInfo.left);
    };
    moveArea.addEventListener("click", clickHandler);
    return progressOptionsExport;
}