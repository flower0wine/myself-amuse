"use strict";
/*
  功能描述:
  创建时间: 2023年 12月 17日
 */
/**
 * 并发任务队列
 */
class ConcurrencyTask {
    /**
     * 创建并发任务队列
     * @param maxConcurrency 最大并发数
     * @param runOverCallback 任务全部执行完毕后的回调
     */
    constructor(maxConcurrency = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY, runOverCallback) {
        this.setRunOverCallback(runOverCallback);
        this.setMaxConcurrency(maxConcurrency);
        this.initial();
    }
    initial() {
        this.canAbort = false;
        this.reset();
    }
    /**
     * 添加任务到任务队列, 不会执行
     * @param task 任务
     * @return 是否添加成功, 如果任务处于执行阶段返回 false
     */
    addTask(task) {
        if (!this.getRunning()) {
            this.taskList.push(task);
            return true;
        }
        return false;
    }
    /**
     * 开始运行任务
     * @param canAbort 是否可中断
     * @param args 任务执行参数
     */
    run(canAbort = false, ...args) {
        this.canAbort = true;
        this.setRunning(true);
        let length = this.taskList.length;
        let maxConcurrency = Math.min(this.getMaxConcurrency(), length);
        for (let index = 0; index < maxConcurrency; index++) {
            this.executeSingleTask(args);
        }
    }
    /**
     * 执行单个任务
     * @param args 函数执行参数
     */
    executeSingleTask(...args) {
        let promise = new Promise((resolve, reject) => {
            this.taskList[this.taskIndex++](resolve, reject, args);
        });
        promise.then(() => {
            this.judgeExecuteEnd(args);
        }).catch((error) => {
            // 如果可以中断任务的执行, 则重置任务队列
            if (this.canAbort) {
                this.reset();
                return;
            }
            console.error(error);
        });
        this.taskPromiseList.push(promise);
    }
    /**
     * 判断是否执行结束
     */
    judgeExecuteEnd(args) {
        if (this.taskIndex >= this.taskList.length && !this.runOver) {
            this.runOver = true;
            let result = this.handleResult;
            Promise.all(this.taskPromiseList).then(() => {
                this.runOverCallback && this.runOverCallback(result);
            }).catch((error) => {
                console.error(error);
            });
            this.reset();
            return;
        }
        this.executeSingleTask(args);
    }
    reset() {
        this.taskList = [];
        this.taskIndex = 0;
        this.taskPromiseList = [];
        this.running = false;
        this.handleResult = [];
    }
    setRunning(running) {
        this.running = running;
    }
    getRunning() {
        return this.running;
    }
    /**
     * 设置任务全部执行完毕后的回调函数, 如果队列正在执行则返回 false
     * @param runOverCallback 回调函数
     */
    setRunOverCallback(runOverCallback) {
        if (!this.getRunning()) {
            this.runOverCallback = runOverCallback;
            return true;
        }
        return false;
    }
    /**
     * 设置最大并发数, 如果正在执行返回 false
     * @param maxConcurrency 最大并发数, 小于等于 0 时使用默认值
     */
    setMaxConcurrency(maxConcurrency) {
        if (maxConcurrency <= 0) {
            this.maxConcurrency = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY;
        }
        if (!this.getRunning()) {
            this.maxConcurrency = maxConcurrency;
            return true;
        }
        return false;
    }
    getMaxConcurrency() {
        return this.maxConcurrency;
    }
}
/**
 * 默认的最大并发数
 */
ConcurrencyTask.DEFAULT_MAX_CONCURRENCY = 2;
//# sourceMappingURL=concurrency_task.js.map