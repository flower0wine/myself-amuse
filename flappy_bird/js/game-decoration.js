/**
 * 功能描述：
 * 创建日期：2023 年 12 月 09 日
 */

// 使用严格模式
'use strict';

let enterGameClassName = "enter-game";

class GameDecoration {
    imagesDirectory;

    doms;

    imagesName;
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
        this.clearAllImagesPath();
    }

    /**
     * 游戏结束展示
     * @param score {number} 分数
     */
    showGameOver(score) {
        this.doms.middleImage.src = this.getImagePath(this.imagesName.gameOver);
        window.setTimeout(() => {
            this.clearAllImagesPath();
            this.showScorePanel(score);
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
     */
    showScorePanel(score) {
        // 奖章
        let medal;
        this.showDom(this.doms.scorePanelContainer);
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
        let imageNameArr = this.resolveScore(score);
        let scoreCount = this.doms.scoreCount;
        let previousScoreCount = this.doms.previousScoreCount;
        for (let index = 0, length = imageNameArr.length; index < length; index++) {
            let img = document.createElement("img");
            img.src = imageNameArr[index];
            scoreCount.append(img);
        }
        for (let index = 0, length = imageNameArr.length; index < length; index++) {
            let img = document.createElement("img");
            img.src = imageNameArr[index];
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
            // 添加 img 标签, 如果数量不够
            let scoreImageListChildren = scoreImageList.children;
            let scoreImageListLength = scoreImageListChildren.length;
            let imageNameArrLength = imageNameArr.length;
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