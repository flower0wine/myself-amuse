/**
 * 功能描述：
 * 创建日期：2023 年 12 月 09 日
 */

// 使用严格模式
'use strict';

let enterGameClassName = "enter-game";

/**
 * 游戏装饰, 主要管理图片的展示和隐藏
 */
class GameDecoration {
    /**
     * 图片装饰的根目录
     * @type {string}
     */
    imagesDirectory;

    /**
     * 相关 DOM 元素
     * @type {{}}
     */
    doms;

    /**
     * 有关的图片名称
     * @type {{}}
     */
    imagesName;

    /**
     * 自定义事件
     * @type {{}}
     */
    customEvent;

    constructor() {
        this.initial();
        this.initialCompleted();
    }

    initial() {
        this.imagesDirectory = "images/"
        this.setImagesName();
        this.queryDom();
        this.addEvent();
        this.createCustomEvent();
        this.enterTheGame();
    }

    initialCompleted() {
        this.hiddenDom(this.doms.scorePanelContainer);
    }

    queryDom() {
        this.doms = {
            topImage: document.querySelector(".top-img"),
            middleImage: document.querySelector(".middle-img"),
            bottomImage: document.querySelector(".bottom-img"),
            scoreImageList: document.querySelector(".score-image-list"),
            scorePanelContainer: document.querySelector(".score-panel-container"),
            scoreMedal: document.querySelector(".scoreMedal"),
            scoreCount: document.querySelector(".score-count"),
            previousScoreCount: document.querySelector(".previous-score-count"),
        };
    }

    /**
     * 设置有关的图片名称
     */
    setImagesName() {
        this.imagesName = {
            gameName: "title.png",
            tutorial: "tutorial.png",
            gameReady: "text_ready.png",
            gameOver: "text_game_over.png",
            scorePanel: "score_panel.png",
            buttonPlay: "button_play.png",
        }
    }

    createCustomEvent() {
        this.customEvent = {
            enterGame: new CustomEvent("enterGame"),
            readyStartGame: new CustomEvent("readyStartGame"),
            startGame: new CustomEvent("startGame"),
        };
    }

    addEvent() {
        let doms = this.doms;
        doms.middleImage.addEventListener("transitionend", this.readyStartGame);
    }

    /**
     * 进入游戏
     */
    enterTheGame() {
        let doms = this.doms;
        this.clearAllImagesPath();
        this.setImageSrc(doms.middleImage, this.imagesName.gameName);
        document.dispatchEvent(this.customEvent.enterGame);
        setTimeout(() => {
            doms.middleImage.classList.add(enterGameClassName);
        }, 1000);
    }

    /**
     * 准备开始游戏
     */
    readyStartGame = () => {
        let doms = this.doms;
        let imagesName = this.imagesName;
        doms.middleImage.classList.remove(enterGameClassName);
        this.clearAllImagesPath();
        this.setImageSrc(doms.topImage, imagesName.gameReady);
        this.setImageSrc(doms.bottomImage, imagesName.tutorial);
        document.dispatchEvent(this.customEvent.readyStartGame);
    }

    /**
     * 开始游戏的读秒动画
     */
    startGameAnimation() {
        // 48 和 52 是 0 到 3 这几张图片的序号
        let fontNumberZero = 48;
        let fontNumber = 52;
        let doms = this.doms;
        this.showStartGame();
        let task = () => {
            fontNumber--;
            this.setImageSrc(doms.middleImage, `font_0${fontNumber}.png`);
        };
        let next = () => {
            new Promise((resolve, reject) => {
                if (fontNumber >= fontNumberZero) {
                    setTimeout(() => {
                        task();
                        resolve();
                    }, 1000);
                } else {
                    reject();
                }
            }).then(next).catch(() => {
                document.dispatchEvent(this.customEvent.startGame);
                this.clearAllImagesPath();
            });
        };
        task();
        next();
    }

    /**
     * 开始游戏展示
     */
    showStartGame() {
        // 目前虽然只有清除所有图片路径, 但是如果以后想在开始游戏时加上
        // 其他图片, 可以在这里加上
        this.clearAllImagesPath();
    }

    /**
     * 游戏结束展示
     * @param score {number} 分数
     * @param highestScore {number} 最高分数
     */
    showGameOver(score, highestScore) {
        this.doms.middleImage.src = this.getImagePath(this.imagesName.gameOver);
        window.setTimeout(() => {
            this.clearAllImagesPath();
            this.showScorePanel(score, highestScore);
        }, 2000);
    }

    /**
     * 展示暂停游戏
     */
    showPauseGame() {
        this.doms.middleImage.src = this.getImagePath(this.imagesName.buttonPlay);
    }

    /**
     * 展示分数, 展示奖章, 展示以前的分数
     * @param score {number} 分数
     * @param highestScore {number} 最高分数
     */
    showScorePanel(score, highestScore) {
        // 奖章
        let medal;
        this.showDom(this.doms.scorePanelContainer);
        // 根据分数计算奖章
        if(score < 2) {
            medal = 0;
        } else if(score < 4) {
            medal = 1;
        } else if(score < 6) {
            medal = 2;
        } else {
            medal = 3;
        }
        this.doms.scoreMedal.src = this.getImagePath(`medals_${medal}.png`);

        // 展示分数
        let scoreNumArr = this.resolveScore(score);
        let highestScoreNumArr = this.resolveScore(highestScore);
        let scoreCount = this.doms.scoreCount;
        let previousScoreCount = this.doms.previousScoreCount;
        // 生成所需数量的图片 img
        // 当前游戏分数
        for (let index = 0, length = scoreNumArr.length; index < length; index++) {
            let img = document.createElement("img");
            img.src = scoreNumArr[index];
            scoreCount.append(img);
        }
        // 历史最高分数, 由于没有记录游戏分数, 所以照搬当前游戏分数, 要记录可以使用 localStorage
        for (let index = 0, length = highestScoreNumArr.length; index < length; index++) {
            let img = document.createElement("img");
            img.src = highestScoreNumArr[index];
            previousScoreCount.append(img);
        }
    }

    /**
     * 设置分数, 将分数转变为图片
     * @param score {number} 分数
     */
    setScore(score) {
        if (0 <= score) {
            let scoreImageList = this.doms.scoreImageList;
            let imageNameArr = this.resolveScore(score);
            let scoreImageListChildren = scoreImageList.children;
            let scoreImageListLength = scoreImageListChildren.length;
            let imageNameArrLength = imageNameArr.length;
            // 如果数量不够添加 img 标签
            while (scoreImageListLength < imageNameArrLength) {
                let img = document.createElement("img");
                scoreImageList.append(img);
                scoreImageListLength++;
            }
            // 设置 img 的 src 属性
            for (let index = 0, length = imageNameArr.length; index < length; index++) {
                let tempChildren = scoreImageListChildren[index];
                let tempScoreStr = imageNameArr[index];
                if (tempChildren.src !== tempScoreStr) {
                    tempChildren.src = tempScoreStr;
                }
            }
        }
    }

    /**
     * 解析分数
     * @param score {number} 分数
     * @return {[string]} 图片路径数组
     */
    resolveScore(score) {
        if(typeof score !== "number" || score < 0) return [];
        let imageNameArr = [];
        let scoreArr = score.toString().split("");
        // 转换为图片路径
        for (let index = 0, length = scoreArr.length; index < length; index++) {
            imageNameArr.push(this.getImagePath(`number_score_0${scoreArr[index]}.png`));
        }
        return imageNameArr;
    }

    /**
     * 设置图片 src 属性, 只能设置位于 images 目录下的图片
     * @param ele {HTMLImageElement} 图片元素
     * @param imgName {string} 图片的名称
     */
    setImageSrc(ele, imgName) {
        ele.src = this.getImagePath(imgName);
    }

    showDom(dom) {
        dom.style.display = "block";
    }

    hiddenDom(dom) {
        dom.style.display = "none";
    }

    /**
     * 将该类管理的所有 img 的 src 设为空字符串
     */
    clearAllImagesPath() {
        let doms = this.doms;
        doms.topImage.src = doms.middleImage.src = doms.bottomImage.src = "";
    }

    getImagePath(imgName) {
        return `${this.imagesDirectory + imgName}`;
    }
}