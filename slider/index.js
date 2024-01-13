/**
 * 功能描述：
 * 创建日期：2023 年 10 月 23 日
 */

// 使用严格模式
'use strict';

function createSlider(background) {
    let div = document.createElement("div");
    div.className = "slider";
    div.style.backgroundImage = `url('${background}')`;
    return div;
}

let UiData = class {
    constructor() {
        this.getData();
        this.queryDom();
        this.generateSliders();
        this.addEvent();
        this.initial();
        this.autoplay();
    }

    initial() {
        this.currentIndex = 1;
        this.delay = 3400;
        this.moving = false;
        this.containerWidth = this.doms.sliderContainer.clientWidth;
        this.doms.sliderList.style.transition = 'all 0ms';
        this.doms.sliderList.style.transform = `translateX(${-this.containerWidth}px)`;
        this.doms.sliderList.clientWidth;
        this.doms.sliderList.style.transition = '';
    }

    autoplay() {
        if(this.moving) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.moving = true;
            this.next();
        }, this.delay);
    }

    queryDom() {
        this.doms = {
            sliderContainer: document.querySelector("#slider-container"),
            sliderList: document.querySelector(".slider-list"),
            pre: document.querySelector(".pre"),
            next: document.querySelector(".next"),
        };
    }

    getData() {
        this.data = data;
    }

    generateSliders() {
        let temp = new DocumentFragment();
        let length = this.data.length;
        let top = this.data[0];
        let bottom = this.data[length - 1];
        this.data.push(top);
        this.data.unshift(bottom);
        length = this.data.length;
        for (let index = 0; index < length; index++) {
            let slider = createSlider(this.data[index].src);
            temp.appendChild(slider);
        }
        this.doms.sliderList.appendChild(temp);
    }

    next() {
        let containerWidth = this.containerWidth;
        this.currentIndex++;
        let x = this.currentIndex * -containerWidth;
        if (this.currentIndex === this.data.length - 1) {
            this.currentIndex = 1;
            this.doms.sliderList.style.transition = 'all 0ms';
            // 跳转到第一张图片上
            x = 0;
            this.doms.sliderList.style.transform = `translateX(${x}px)`;
            // 立马重绘
            this.doms.sliderList.clientWidth;
            // 跳转后再左移, 循环的视觉效果
            x -= containerWidth;
        }
        this.doms.sliderList.style.transform = `translateX(${x}px)`;
        this.doms.sliderList.style.transition = '';
    }

    pre() {
        let containerWidth = this.containerWidth;
        this.currentIndex--;
        let x = this.currentIndex * -containerWidth;
        if (this.currentIndex === 0) {
            this.currentIndex = this.data.length - 2;
            this.doms.sliderList.style.transition = 'all 0ms';
            // 跳转到最后一张图片上
            x = -containerWidth * this.data.length - 1;
            this.doms.sliderList.style.transform = `translateX(${x}px)`;
            this.doms.sliderList.clientWidth;
            x += containerWidth;
        }
        this.doms.sliderList.style.transform = `translateX(${x}px)`;
        this.doms.sliderList.style.transition = '';
    }

    addEvent() {
        let fn = (callback) => {
            if(this.timer) {
                clearInterval(this.timer);
            }
            if(this.moving) {
                return;
            }
            this.moving = true;
            callback.apply(this);
            this.autoplay();
        };
        this.moving = false;
        this.doms.pre.addEventListener("click", fn.bind(null, this.pre));
        this.doms.next.addEventListener("click",  fn.bind(null, this.next));
        this.doms.sliderList.addEventListener("transitionend", () => {
            this.moving = false;
        });
    }
}
let ui = new UiData();
