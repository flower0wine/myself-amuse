/**
 * 功能描述：
 * 创建日期：2023 年 11 月 28 日
 */

// 使用严格模式
'use strict';

class InnerResolver {
    optionHandlers;

    constructor() {
        this.optionHandlers = [];
    }

    /**
     * 解析参数
     * @param options 传入的参数
     */
    resolveOptions(options) {
        for (let handler of this.optionHandlers) {
            handler(options);
        }
    }


}

class QuickDevelop {
    /**
     * @param name {string}
     * @param options {{el: string | HTMLElement, beforeCreate: function, }}
     */
    constructor(name, options) {
        this.names.push(name);
        let innerResolver = new InnerResolver();
        innerResolver.resolveOptions(options);
    }

    /**
     * 修改 ele 元素的 innerHTML 属性
     * @param ele {Element} HTML 元素
     * @param innerHTML {string} 要填充的内容
     */
    changeInnerHTML(ele, innerHTML) {
        ele.innerHTML = innerHTML;
    }

}

QuickDevelop.prototype.names = [];

let quickDevelop =  new QuickDevelop("quick", {
    el: "#app",
});





