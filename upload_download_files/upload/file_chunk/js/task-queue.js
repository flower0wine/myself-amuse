/**
 * 功能描述：
 * 创建日期：2023 年 12 月 01 日
 */

// 使用严格模式
'use strict';

/**
 * 任务队列, 实现单位时间内执行指定最大数量的任务的执行
 * 即在正在执行的任务执行完成前, 其他的任务必须等待, 当然正在执行的任务的数量可以指定
 */
class TaskQueue {

    /**
     * 函数返回值
     * @type {[*]}
     */
    result;
    /**
     * 任务数组
     * @type {[function]}
     */
    taskList;
    /**
     * 用 Promise 包裹任务
     * @type {[Promise]}
     */
    taskPromiseArray;
    /**
     * 任务执行的索引
     * @type {number}
     */
    taskIndex;
    /**
     * 最大并发数
     * @type {number}
     */
    maximumConcurrency;
    /**
     * 是否运行结束, 这个属性的作用是防止多次执行运行结束回调
     * @type {boolean}
     */
    runOver;
    /**
     * 运行结束回调
     * @type {function}
     */
    runOverCallback;

    constructor(maximumConcurrency = 2) {
        this.maximumConcurrency = maximumConcurrency;
        this.setRunOver(true);
        this.initial();
    }

    /**
     * 添加任务, 任务是函数形式
     * @param task {function} 任务, 函数
     */
    addTask(...task) {
        this.taskList.push(...task);
    }

    /**
     * 运行队列中的任务, 运行结束后重置执行队列
     * @param args 每个任务要执行时需要的参数, 可变参数
     */
    run(...args) {
        this.setRunOver(false);
        let maximumConcurrency = Math.min(this.maximumConcurrency, this.taskList.length);
        for (let index = 0; index < maximumConcurrency; index++) {
            this.executeSingleTask(args);
        }
    }

    /**
     * 每个请求结束后都会判断是否执行结束
     * @param args 每个任务要执行时需要的参数, 可变参数
     */
    judgeExecuteEnd(args) {
        let taskList = this.taskList;
        let taskPromiseArray = this.taskPromiseArray;
        // 当所有的任务都得到执行, 但部分任务还没有执行完毕
        // 这里 !this.getRunOver() 可以替换为 this.taskList.length === 0
        // 这是由于执行了 initial()
        if (this.taskIndex >= taskList.length && !this.getRunOver()) {
            this.setRunOver(true);
            let result = this.getResult();
            // 等待所有的任务执行完毕后执行回调
            Promise.all(taskPromiseArray).then(() => {
                this.runOverCallback && this.runOverCallback(result);
            });
            this.initial();
            return;
        }
        // 如果还有任务则继续执行
        this.executeSingleTask(args);
    }

    /**
     * 执行一个任务
     * @param args 每个任务要执行时需要的参数, 可变参数
     */
    executeSingleTask(args) {
        let taskList = this.taskList;
        let taskPromiseArray = this.taskPromiseArray;
        let promise = new Promise((resolve, reject) => {
            // 执行任务并将返回值保存
            this.result.push(taskList[this.taskIndex++](resolve, reject, ...args));
        }).then(() => {
            this.judgeExecuteEnd(args);
        }).catch(() => {
            this.initial();
        });
        taskPromiseArray.push(promise);
    }

    getResult() {
        return this.result;
    }

    /**
     * 设置任务执行完成回调
     * @param callback 回调函数
     */
    setRunOverCallback(callback) {
        this.runOverCallback = callback;
    }

    getRunOver() {
        return this.runOver;
    }

    setRunOver(runOver) {
        this.runOver = runOver;
    }

    initial() {
        this.result = [];
        this.taskList = [];
        this.taskPromiseArray = [];
        this.taskIndex = 0;
    }
}

