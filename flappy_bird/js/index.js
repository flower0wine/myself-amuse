/**
 * 功能描述：
 * 创建日期：2023 年 12 月 08 日
 */

// 使用严格模式
'use strict';

const notInitialClassName = "not-initial";
const pauseClassName = "pause";
const notPlayClassName = "not-play";
const HIGHEST_SCORE_KEY = "highestScoreKey";

/**
 * 小鸟速度增加限流
 * @type function
 */
let addBirdSpeedThrottle;

/**
 * 小鸟上升限流
 * @type function
 */
let birdUpThrottle;

class FlappyBirdGame {
    /**
     * DOM 元素
     * @type {{Element}}
     */
    doms;

    /**
     * 小鸟类
     * @type {Bird}
     */
    bird;

    /**
     * 装饰图片, 在游戏中中部、上部、下部出现的图片由它来管理
     * @type {GameDecoration}
     */
    gameDecoration;

    /**
     * 水管
     * @type {[Pipe]}
     */
    pipeArr;

    /**
     * 事件处理程序
     * @type {[function]}
     */
    pipeHandler;

    /**
     * 正在游戏中
     */
    playing;

    /**
     * 玩家是否正在控制小鸟
     * @type {boolean}
     */
    inControl;

    /**
     * 距离上最近的水管
     * @type {Element}
     */
    nearestPipe;

    /**
     * 距离上最近的水管的索引
     * @type {number}
     */
    nearestPipeIndex;

    /**
     * 是否已经碰撞
     * @type {boolean}
     */
    crashed;

    /**
     * 管道区域的高度
     * @type {number}
     */
    pipeHeight;

    /**
     * 得分
     * @type {number}
     */
    score;

    /**
     * 添加小鸟速度延迟
     */
    addSpeedDelay;

    /**
     * 小鸟上升延迟
     */
    birdUpDelay;

    constructor() {
        this.initial();
        this.initialCompleted();

        this.bird = new Bird();
        this.gameDecoration = new GameDecoration();

        this.gameDecoration.setScore(0);
        this.addSpeedDelay = 211;
        this.birdUpDelay = 6;

        addBirdSpeedThrottle = throttle(this.bird.addSpeed, this.addSpeedDelay);
        birdUpThrottle = throttle(this.bird.controlBirdUp, this.birdUpDelay);
    }

    initial() {
        this.pipeHandler = [];
        this.setPlaying(false);
        this.setCrashed(false);
        this.setScore(0);
        this.queryDom();
        this.generatePipe();
        this.addEvent();
        // 容器高度
        let flappyContainerHeight = parseInt(getComputedStyle(this.doms.flappyBirdContainer).height);
        // 地面高度
        let landHeight = parseInt(getComputedStyle(this.doms.land).height);
        // 管道区域高度
        this.setPipeHeight(flappyContainerHeight - landHeight);
    }

    initialCompleted() {
        let doms = this.doms;
        doms.flappyBirdContainer.classList.remove(notInitialClassName);
    }

    generatePipe() {
        let pipeArr = this.pipeArr = [];
        // 这里的 10 是根据 CSS 动画时间得到的, 当然也可以通过 js 获取
        for (let index = 0; index < 10; index++) {
            pipeArr.push(new Pipe());
        }
        let pipeList = this.doms.pipeList;
        for (let index = 0, length = pipeArr.length; index < length; index++) {
            let pipe = pipeArr[index];
            // 设置每个管道动画的延迟时间
            pipe.setDelay(1000 * index);
            pipeList.append(pipe.getPipeDom());
        }
        // 设置最近的管道为第一个管道
        this.nearestPipeIndex = 0;
        this.nearestPipe = pipeArr[0].getPipeDom();
    }

    addEvent() {
        document.addEventListener("readyStartGame", this.readyStartGame);
        document.addEventListener("startGame", this.startGame);
        this.addPipeEvent();
    }

    /**
     * 添加管道动画循环事件
     */
    addPipeEvent() {
        let pipeArr = this.pipeArr;
        let pipeHandler = this.pipeHandler;
        for (let index = 0, length = pipeArr.length; index < length; index++) {
            let pipe = pipeArr[index];
            let handler = () => {
                pipe.randomGenerate();
            };
            pipeHandler[index] = handler;
            // 管道动画每次循环重新生成管道偏移量
            pipe.getPipeDom().addEventListener("animationiteration", handler);
        }
    }

    /**
     * 移除管道管道动画循环事件
     */
    removePipeEvent() {
        let pipeArr = this.pipeArr;
        let pipeHandler = this.pipeHandler;
        for (let index = 0, length = pipeArr.length; index < length; index++) {
            let pipe = pipeArr[index];
            pipe.getPipeDom().removeEventListener("animationiteration", pipeHandler[index]);
        }
    }

    /**
     * 准备开始游戏
     */
    readyStartGame = () => {
        let doms = this.doms;
        this.removePauseClassName();
        this.bird.addChangeBirdSkinEvent();
        // 添加小鸟
        doms.flappyBirdContainer.append(this.bird.getBirdDom());
        // 开始游戏初始动画后在添加按下空格开始游戏事件
        document.addEventListener("keyup", this.keyupToFirstStartGame);
    }

    /**
     * 第一次开始游戏, 由于暂停游戏后再次开始游戏不进行读秒, 所以这里定义一个首次开始游戏函数
     * @param e {KeyboardEvent} 事件对象
     */
    keyupToFirstStartGame = (e) => {
        e.preventDefault();
        if (e.code === spaceCode) {
            this.firstPlayGame();
            document.removeEventListener("keyup", this.keyupToFirstStartGame);
        }
    }

    /**
     * 还未开始游戏, 按下开始游戏键后等待读秒结束后游戏开始
     * @param e {KeyboardEvent} 事件对象
     */
    keyupToStartGame = (e) => {
        e.preventDefault();
        if (e.code === spaceCode) {
            this.startGame();
            this.startGameEventHandle();
        }
    }

    /**
     * 按下暂停游戏键后暂停游戏
     * @param e {KeyboardEvent} 事件对象
     */
    keyupToPauseGame = (e) => {
        e.preventDefault();
        if (e.code === escCode) {
            this.pauseGame();
        }
    }

    /**
     * 控制小鸟上升
     * @param e {KeyboardEvent} 事件对象
     */
    keydownToControlBirdUp = (e) => {
        e.preventDefault();
        if (e.code === spaceCode) {
            if (this.getInControl()) return;

            this.bird.resetSpeed();
            this.setInControl(true);
            this.bird.setMoveDirection(MoveDirection.UP);
            this.controlUpBird();
        }
    }

    /**
     * 控制小鸟上升
     */
    controlUpBird = () => {
        requestAnimationFrame(() => {
            if (!this.getInControl()) return;

            this.birdUp();
            this.addSpeed();
            this.judgeCrash();

            if (this.getCrashed()) return;
            this.controlUpBird();
        });
    }

    birdUp = () => {
        birdUpThrottle.call(this.bird);
    }

    /**
     * 弹起空格键时, 小鸟自动下落
     * @param e {KeyboardEvent} 事件对象
     */
    keyupToAutoBirdMove = (e) => {
        e.preventDefault();
        if (e.code === spaceCode) {
            if (!this.getInControl()) return;

            this.bird.resetSpeed();
            this.setInControl(false);
            this.bird.setMoveDirection(MoveDirection.DOWN);
            this.run();
        }
    }

    /**
     * 开始游戏时的事件处理
     */
    startGameEventHandle() {
        document.addEventListener("keypress", this.keydownToControlBirdUp);
        document.addEventListener("keyup", this.keyupToAutoBirdMove);
        document.addEventListener("keyup", this.keyupToPauseGame);
        document.removeEventListener("keyup", this.keyupToStartGame);
    }

    /**
     * 暂停游戏时的事件处理
     */
    pauseGameEventHandle() {
        document.addEventListener("keyup", this.keyupToStartGame);
        document.removeEventListener("keyup", this.keyupToPauseGame);
        document.removeEventListener("keyup", this.keyupToAutoBirdMove);
        document.removeEventListener("keypress", this.keydownToControlBirdUp);
    }

    /**
     * 游戏结束
     */
    gameOver() {
        document.removeEventListener("keyup", this.keyupToPauseGame);
        document.removeEventListener("keyup", this.keyupToAutoBirdMove);
        document.removeEventListener("keypress", this.keydownToControlBirdUp);
        this.setPlaying(false);
        this.addPauseClassName();
    }

    /**
     * 第一次开始游戏
     */
    firstPlayGame() {
        this.addPauseClassName();
        this.removeNotPlayClassName();
        this.bird.wingAnimation();
        this.bird.removeStartFlying();
        this.gameDecoration.startGameAnimation();
    }

    /**
     * 游戏开始
     */
    startGame = () => {
        this.bird.resetSpeed();
        this.setPlaying(true);
        this.gameDecoration.clearAllImagesPath();
        this.removePauseClassName();
        this.startGameEventHandle();
        this.run();
    }

    /**
     * 游戏暂停
     */
    pauseGame = () => {
        this.setPlaying(false);
        this.gameDecoration.showPauseGame();
        this.pauseGameEventHandle();
        this.addPauseClassName();
    }

    /**
     * 持续运行
     */
    run() {
        let exec = () => {
            requestAnimationFrame(() => {
                // 是否处于游戏状态, 是否处于玩家操控状态, 是否发生碰撞
                if (this.getPlaying() && !this.getInControl() && !this.getCrashed()) {
                    this.bird.birdAutoMove();
                    // 小鸟是否到达边界
                    if (this.bird.getReachTheBoundary()) {
                        this.birdCrash();
                    } else {
                        this.judgeCrash();
                    }
                    exec();
                }
            });
            this.addSpeed();
        }
        exec();
    }

    /**
     * 判断小鸟是否与管道发生碰撞
     */
    judgeCrash() {
        let nearestPipeDom = this.nearestPipe;
        // 第一个管道的水平偏移量
        let firstPipeTranslateX = getComputedStyle(nearestPipeDom).transform.split(", ")[4];
        let pipeArr = this.pipeArr;
        let nearestPipeIndex = this.nearestPipeIndex;
        let nearestPipe = pipeArr[nearestPipeIndex];
        // 当小鸟位于管道右侧时, 设置最近的管道
        if (firstPipeTranslateX <= 23) {
            this.addScore();
            nearestPipeIndex = ++nearestPipeIndex % pipeArr.length;
            this.nearestPipeIndex = nearestPipeIndex;
            this.nearestPipe = pipeArr[nearestPipeIndex].getPipeDom();
        }
        // 当小鸟位于上下两个管道之间
        else if (firstPipeTranslateX <= 105) {
            let bird = this.bird;
            let topOffset = nearestPipe.getTopOffset();
            let bottomOffset = topOffset + nearestPipe.getPipeVerticalBetween();
            let birdYOffset = bird.getYOffset();
            let birdHeight = bird.getBirdHeight();
            if (!(topOffset <= birdYOffset && birdYOffset <= bottomOffset - birdHeight)) {
                this.birdCrash();
            }
        }
    }

    /**
     * 小鸟碰撞到管道
     */
    birdCrash() {
        this.setCrashed(true);
        this.gameOver();

        let score = this.getScore();
        let highestScore = window.localStorage.getItem(HIGHEST_SCORE_KEY);

        if(highestScore) {
            highestScore = parseInt(highestScore);
        } else {
            highestScore = 0;
        }
        if(highestScore < score) {
            highestScore = score;
            window.localStorage.setItem(HIGHEST_SCORE_KEY, JSON.stringify(score));
        }
        this.gameDecoration.showGameOver(score, highestScore);
    }

    /**
     * 加分
     */
    addScore() {
        let score = this.getScore() + 1;
        this.setScore(score);
        this.gameDecoration.setScore(score);
    }

    /**
     * 小鸟移动加速
     */
    addSpeed() {
        addBirdSpeedThrottle.call(this.bird);
    }

    addPauseClassName() {
        let classList = this.doms.flappyBirdContainer.classList;
        if (!classList.contains(pauseClassName)) {
            classList.add(pauseClassName);
        }
    }

    removePauseClassName() {
        this.doms.flappyBirdContainer.classList.remove(pauseClassName);
    }

    removeNotPlayClassName() {
        this.doms.flappyBirdContainer.classList.remove(notPlayClassName);
    }

    queryDom() {
        this.doms = {
            land: document.querySelector(".land"),
            pipeList: document.querySelector(".pipe-list"),
            flappyBirdContainer: document.querySelector(".flappy-bird-container"),
        };
    }

    setPlaying(playing) {
        this.playing = playing;
    }

    getPlaying() {
        return this.playing;
    }

    setInControl(inControl) {
        this.inControl = inControl;
    }

    getInControl() {
        return this.inControl;
    }

    setCrashed(crashed) {
        this.crashed = crashed;
    }

    getCrashed() {
        return this.crashed;
    }

    setPipeHeight(pipeHeight) {
        this.pipeHeight = pipeHeight;
    }

    setScore(score) {
        this.score = score;
    }

    getScore() {
        return this.score;
    }
}

console.log(new FlappyBirdGame());