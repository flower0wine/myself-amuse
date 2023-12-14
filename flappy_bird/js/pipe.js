/**
 * 功能描述：
 * 创建日期：2023 年 12 月 09 日
 */

// 使用严格模式
'use strict';

const modelPipeGroupClassName = "model-pipe-group";

/**
 * 水管类, 包含上下两个水管
 */
class Pipe {

    /**
     * 水管模版
     * @type {Element}
     */
    static pipeModel = document.querySelector(".pipe-group");

    /**
     * 水管
     * @type {Element | Node}
     */
    pipeDom;

    /**
     * 上面的水管偏移量
     * @type {number}
     */
    topOffset;

    /**
     * 下面的水管偏移量
     * @type {number}
     */
    bottomOffset;

    /**
     * 两个管道之间的间距
     * @type {number}
     */
    pipeVerticalBetween;

    static {
        Pipe.pipeModel.remove();
    }

    constructor(topOffset, bottomOffset) {
        this.setPipeVerticalBetween(100);
        this.pipeDom = Pipe.pipeModel.cloneNode(true);
        this.paramsHandle(topOffset, bottomOffset);
    }

    /**
     * 如果传入了 topOffset 和 bottomOffset
     * @param topOffset {number} 上面的水管偏移量
     * @param bottomOffset {number} 下面的水管偏移量
     */
    paramsHandle(topOffset, bottomOffset) {
        if (Number.isSafeInteger(topOffset) && Number.isSafeInteger(bottomOffset)) {
            this.topOffset = topOffset;
            this.bottomOffset = bottomOffset;
        } else {
            this.randomGenerate();
        }
    }

    /**
     * 随机设置两个管道的偏移量
     */
    randomGenerate() {
        let pipeHeight = 400;
        let pipeVerticalBetween = this.getPipeVerticalBetween();
        let minOffset = 50;
        let maxOffset = pipeHeight - pipeVerticalBetween - (minOffset << 2);
        let offset = minOffset + (Math.floor(Math.random() * maxOffset));
        this.topOffset = offset;
        this.bottomOffset = pipeHeight - offset - pipeVerticalBetween;
        this.setTopPipeOffset(this.topOffset);
        this.setBottomPipeOffset(this.bottomOffset);
    }

    setTopPipeOffset(topOffset) {
        this.pipeDom.children[0].style.transform = `translateY(${topOffset}px)`;
    }

    setBottomPipeOffset(bottomOffset) {
        this.pipeDom.children[1].style.transform = `translateY(${-bottomOffset}px)`;
    }

    getTopOffset() {
        return this.topOffset;
    }

    getBottomOffset() {
        return -this.bottomOffset;
    }

    getPipeDom() {
        return this.pipeDom;
    }

    setPipeVerticalBetween(pipeVerticalBetween) {
        this.pipeVerticalBetween = pipeVerticalBetween;
    }

    getPipeVerticalBetween() {
        return this.pipeVerticalBetween;
    }

    /**
     * 设置延迟
     * @param delay {number} 毫秒
     */
    setDelay(delay) {
        this.pipeDom.style.animationDelay = `${delay}ms`;
    }
}