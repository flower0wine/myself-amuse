/**
 * 功能描述：
 * 创建日期：2023 年 12 月 09 日
 */

// 使用严格模式
'use strict';

const wingAnimationClassName = "wing-animation";
const xOffsetCSSVarName = "--bird-x-offset";

class MoveDirection {
    direction;

    static UP = new MoveDirection("UP");

    static DOWN = new MoveDirection("DOWN");

    constructor(direction) {
        this.direction = direction;
    }

    /**
     * 是否是上升状态
     * @param direction {MoveDirection} 移动方向
     * @return {boolean} 上升状态返回 true
     */
    static isUp(direction) {
        return MoveDirection.UP === direction;
    }

    /**
     * 是否是下降状态
     * @param direction {MoveDirection} 移动方向
     * @return {boolean} 下降状态返回 true
     */
    static isDown(direction) {
        return MoveDirection.DOWN === direction;
    }
}

class Bird {
    /**
     * 图片根路径
     */
    imagesDirectory;

    /**
     * 初始的速度
     * @type {number}
     */
    initialSpeed;

    /**
     * 当前皮肤编号
     * @type {number}
     */
    currentSkin;

    /**
     * 所有的小鸟皮肤, 编号
     * @type {[number]}
     */
    skinList;

    /**
     * 小鸟 DOM
     * @type {Element}
     */
    birdDom;

    /**
     * 小鸟水平方向的偏移量
     * @type {number}
     */
    xOffset;

    /**
     * 小鸟竖直方向的偏移量
     * @type {number}
     */
    yOffset;

    /**
     * 移动状态
     * @type {{speed: number, maxSpeed: number, minHeight: number, maxHeight: number, direction: MoveDirection}}
     */
    moveStatus;

    /**
     * 小鸟是否到达下边界
     * @type {boolean}
     */
    reachBottomBoundary;

    /**
     * 小鸟动画名称
     * @type {string}
     */
    animationName;

    constructor() {
        this.initial();
        this.initialCompleted();
    }

    initial() {
        this.imagesDirectory = "./images/";
        this.currentSkin = 0;
        this.skinList = [0, 1, 2];
        this.setInitialSpeed(1);
        this.queryDom();
        this.setReachBottomBoundary(false);
        this.setYOffset(200);
        this.setBirdXOffset(70);
    }

    initialCompleted() {
        this.moveStatus = {
            speed: this.getInitialSpeed(),
            maxSpeed: 4,
            minHeight: 0,
            maxHeight: 372,
            direction: MoveDirection.DOWN,
        };
        this.animationName = getComputedStyle(this.birdDom).animationName;
        this.removeBirdDom();
    }

    queryDom() {
        this.birdDom = document.querySelector(".bird");
    }

    /**
     * 翅膀扇动动画
     */
    wingAnimation() {
        this.birdDom.classList.add(wingAnimationClassName);
    }

    /**
     * 移除开始游戏前的小鸟飞翔动画
     */
    removeStartFlying() {
        let animationName = this.animationName;
        animationName = animationName.split(", ")[0];
        this.birdDom.style.animationName = animationName;
        this.removeChangeBirdSkinEvent();
    }

    addChangeBirdSkinEvent() {
        document.addEventListener("keyup", this.changeBirdSkin);
    }

    /**
     * 移除改变小鸟皮肤事件
     */
    removeChangeBirdSkinEvent() {
        document.removeEventListener("keyup", this.changeBirdSkin);
    }

    /**
     * 小鸟自动移动
     */
    birdAutoMove() {
        this.setBirdYOffset(this.getYOffset() + this.getSpeed());
    }

    /**
     * 控制小鸟上升
     */
    controlBirdUp() {
        this.setBirdYOffset(this.getYOffset() - this.getSpeed());
    }

    /**
     * 增加小鸟的向上或向下的飞翔速度
     */
    addSpeed() {
        if (this.getSpeed() < this.getMaxSpeed()) {
            this.setSpeed(this.getSpeed() + 1);
        }
    }

    resetSpeed() {
        this.setSpeed(this.getInitialSpeed());
    }

    /**
     * 改变小鸟的皮肤
     * @param e {KeyboardEvent} 事件对象
     */
    changeBirdSkin = (e) => {
        if(e.code === arrowUpCode) {
            let currentSkin = this.currentSkin;
            let birdDom = this.birdDom;
            let birdDomStyle = birdDom.style;
            currentSkin++;
            currentSkin %= this.skinList.length;
            this.currentSkin = currentSkin;

            let animationName = this.animationName;
            animationName = animationName.replace(/flying_\d/, `flying_${currentSkin}`);
            this.animationName = animationName;
            birdDomStyle.backgroundImage = getImagesUrl(this.getImagePath(`bird${currentSkin}_0.png`));
            birdDomStyle.animationName = animationName;
        }
    }

    getBirdDom() {
        return this.birdDom;
    }

    removeBirdDom() {
        this.birdDom.remove();
    }

    /**
     * 设置小鸟水平偏移量
     * @param xOffset {number} 偏移量
     */
    setBirdXOffset(xOffset) {
        this.setXOffset(xOffset);
        document.documentElement.style.setProperty(xOffsetCSSVarName, `${xOffset}px`);
    }

    /**
     * 设置小鸟竖直偏移量
     * @param yOffset {number} 偏移量
     */
    setBirdYOffset(yOffset) {
        let {minHeight, maxHeight} = this.moveStatus;
        let exec = () => {
            this.setYOffset(yOffset);
            this.birdDom.style.transform = `translateY(${yOffset}px)`;
        };
        // 判断小鸟高度是否碰壁, 未碰壁继续移动
        if (minHeight <= yOffset && yOffset <= maxHeight) {
            exec();
        } else {
            // 这个是当速度太快时, 小鸟移动不到地面上, 假设小鸟与地面距离 5 像素, 但是此时速度为 10, 是到不了地面的
            if (maxHeight - yOffset < this.getSpeed()) {
                yOffset = maxHeight;
                exec();
                this.setReachBottomBoundary(true);
            }
        }
    }

    setXOffset(xOffset) {
        this.xOffset = xOffset;
    }

    setYOffset(yOffset) {
        this.yOffset = yOffset;
    }

    getYOffset() {
        return this.yOffset;
    }

    /**
     * 设置移动方向
     * @param direction {MoveDirection} 移动方向, 参数可用 {@link MoveDirection}
     */
    setMoveDirection(direction) {
        this.moveStatus.direction = direction;
    }

    getMoveDirection() {
        return this.moveStatus.direction;
    }

    setSpeed(speed) {
        this.moveStatus.speed = speed;
    }

    getSpeed() {
        return this.moveStatus.speed;
    }

    setMaxSpeed(maxSpeed) {
        this.moveStatus.maxSpeed = maxSpeed;
    }

    getMaxSpeed() {
        return this.moveStatus.maxSpeed;
    }

    setReachBottomBoundary(reachBottomBoundary) {
        this.reachBottomBoundary = reachBottomBoundary;
    }

    getReachTheBoundary() {
        return this.reachBottomBoundary;
    }

    /**
     * 返回小鸟的高度
     * @return {number} 高度
     */
    getBirdHeight() {
        return parseInt(getComputedStyle(this.birdDom).height);
    }

    setInitialSpeed(initialSpeed) {
        this.initialSpeed = initialSpeed;
    }

    getInitialSpeed() {
        return this.initialSpeed;
    }

    /**
     * 获取小鸟图片的路径
     * @param imgName {string} 图片名称
     * @return {string} 返回图片路径
     */
    getImagePath(imgName) {
        return `${this.imagesDirectory + imgName}`;
    }
}