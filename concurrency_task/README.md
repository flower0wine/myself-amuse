### 一、项目创建时间
项目于 2023年 12月 17日创建。

### 二、项目说明
本项目是使用 JavaScript 和 TypeScript 来实现并发队列。在 src 目录中的 `concurrency_task.ts` 是源文件，其他的文件是用来测试该代码的。

### 三、项目解释

#### 1. 前言
本文使用了 TypeScript 和 JavaScript，可能有的读者并没有学过 TypeScript，担心看不懂。其实我认为有了 TypeScript 你应该更容易看懂，因为 TypeScript 仅仅是繁琐了一点，因为它只是给变量加上了类型，但是它能增加代码的可读性和可维护性，所以你应该能快速理解。

安装 TypeScript 见文末。

生活中许多同时发生的事情，比如：你在打代码，他在打代码，她也在打代码，而我在看你们打代码。这不是并发而是并行。

并发和并行的最大区别就是多件事情是交给了一个人做还是多个人做。如果是交给了一个人做就是并发，交给了多个人做就是并行。而这里要说的是并发执行，并使用 TypeScript 和 JavaScript 来实现一个并发队列。

在生活中我们能处处看到并发队列，与本文要说的并发队列非常像。比如说排队，在一个售票窗口，只能一个一个的进行，后面的人只能先等待前面的人买完票了，处理完手续后才能进行买票。本文要讲的并发队列原理与这个非常像。

#### 2. 核心代码解析
先不展示全部的代码，讲清楚核心的逻辑后，其他的代码也就是起个辅助的作用，也就没有难理解的地方了。

核心代码我将其分为以下几个部分，从易到难进行讲解：

- 使用示例
- 添加任务
- 运行任务
- 执行一个任务
- 判断是否执行结束

##### 2.1. 使用示例
可以看到下面定义并添加了了两个任务，均在两秒后输出一段话到控制台，但是我们在创建并发队列时指定最大并发数为 1，所以一次只能执行一个任务，并且该任务队列的执行顺序是先添加的先执行。

```ts
// 所有的任务执行完毕后的回调函数
let callback = (result: any) => {
    console.log(result);
};

let concurrencyTask = new ConcurrencyTask(1, callback);

// 添加任务
concurrencyTask.addTask((resolve, reject) => {
    setTimeout(() => {
        console.log("2 秒后得到执行"); // 2 秒后输出
        resolve();
    }, 2000);
});

concurrencyTask.addTask((resolve, reject) => {
    setTimeout(() => {
        console.log("4 秒后得到执行"); // 4 秒后输出
        resolve();
    }, 2000);
});

concurrencyTask.run(false);
```

##### 2.2. 添加任务
下面是添加任务的代码，添加的任务要求是一个函数，并在执行时会接收到三个参数：`resolve`，`rejecct`，`args`。这三个参数分别为 Promise 的 `resolve` 和 `reject`，而 `args` 是函数执行需要的可变参数，如果在任务队列执行过程中添加任务则不允许加入。

```ts
type Task = (resolve: Function, reject: Function, ...args: Array<any>) => any;

/**
 * 添加任务到任务队列, 不会执行
 * @param task 任务
 * @return 是否添加成功, 如果任务处于执行阶段返回 false
 */
public addTask(task: Task): boolean {
    if (!this.getRunning()) {
        this.taskList.push(task);
        return true;
    }
    return false;
}
```

##### 2.3. 运行任务
`canAbort` 参数表示队列执行过程中是否可中断，在执行的任务中调用 `reject` 函数即可中断任务的执行，中断后任务队列将进行重置，清空已执行的和未执行的任务以及重置其他数据。

下面的代码的意思是执行指定最大并发数的数量的任务，如果最大并发数大于任务总数量，则以任务总数量为最大并发数来执行。

```ts
/**
 * 开始运行任务
 * @param canAbort 是否可中断
 * @param args 任务执行参数
 */
public run(canAbort: boolean = false, ...args: Array<any>): void {
    this.canAbort = canAbort;
    this.setRunning(true);
    let length = this.taskList.length;
    let maxConcurrency = Math.min(this.getMaxConcurrency(), length);
    for (let index = 0; index < maxConcurrency; index++) {
        this.executeSingleTask(args);
    }
}
```

##### 2.4. 执行一个任务
由于任务执行具有异步性，所以我们使用 `Promise` 来包裹任务，并把 `resolve`, `reject` 传递给任务函数，让它来决定任务何时结束。

当一个任务调用了 `resolve` 函数时，将会判断任务是否全部得到执行，即执行 `judgeExecuteEnd` 函数，如果任务调用 `reject` 函数，将会判断是否可以中断任务的执行，并重置任务队列，当然不想重置任务队列可以在源代码上进行修改，这里我就不改了。

然后每个任务的 `promise` 会保存在 `taskPromiseList` 变量中，它是一个 `Promise` 类型的数组。

```ts
/**
 * 执行单个任务
 * @param args 函数执行参数
 */
private executeSingleTask(...args: Array<any>): void {
    let promise = new Promise<void>((resolve, reject) => {
        let result = this.taskList[this.taskIndex++](resolve, reject, args);
        this.handleResult.push(result);
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
```


##### 2.5. 判断是否执行结束
下面的代码中 `taskIndex` 是当前任务的索引，`runOver` 为是否执行结束的标志。

这里我们判断 `taskPromiseList` 中的 `promise` 是否全部完成

```ts
/**
 * 判断是否执行结束
 * @param args 函数执行所需参数
 */
private judgeExecuteEnd(args: Array<any>): void {
    // 如果全部任务都得到执行, 并且执行没有结束
    // 设置 runOver 的原因是最后几个并发执行的任务在执行完毕后都会
    // 触发该函数, 而 runOverCallback 函数应只执行一次
    if (this.taskIndex >= this.taskList.length && !this.runOver) {
        this.runOver = true;
        let result = this.handleResult;
        Promise.all(this.taskPromiseList).then(() => {
            this.runOverCallback && this.runOverCallback(result);
        }).catch((error) => {
            // 如果不允许中断，则会执行任务全部完成回调
            if(!this.canAbort) {
                this.runOverCallback && this.runOverCallback(result);
            }
            console.error(error);
        });
        this.reset();
        return;
    }
    // 如果没有执行结束，就执行下一个任务
    this.executeSingleTask(args);
}
```

#### 3. 源代码展示
下面的代码直接复制到 `ts` 文件中是不会有任何的效果的，因为浏览器不能解析 `ts` 代码，我们需要使用 `ts` 编译器将其编译为 `js` 代码后，再引用 `js` 文件即可。安装 TypeScript 见文末。

```ts
/* 
  功能描述: 并发队列
  创建时间: 2023年 12月 17日
 */

type Task = (resolve: Function, reject: Function, ...args: Array<any>) => any;
type ResultCallback = (result: Array<any>) => any;

/**
 * 并发任务队列
 */
class ConcurrencyTask {

    /**
     * 任务集合
     */
    private taskList: Array<Task>;

    /**
     * 处理结果
     */
    private handleResult: Array<any>;

    /**
     * 是否正在执行任务
     */
    private running: boolean;

    /**
     * 最大并发数
     */
    private maxConcurrency: number;

    /**
     * 默认的最大并发数
     */
    private static DEFAULT_MAX_CONCURRENCY: number = 2;

    /**
     * 当前任务索引
     */
    private taskIndex: number;

    /**
     * 用 promise 包裹任务
     */
    private taskPromiseList: Array<Promise<void>>;

    /**
     * 是否可中断
     */
    private canAbort: boolean;

    /**
     * 执行结束
     */
    private runOver: boolean;

    /**
     * 任务全部执行完毕时的回调函数
     */
    private runOverCallback: ResultCallback;

    /**
     * 创建并发任务队列
     * @param maxConcurrency 最大并发数
     * @param runOverCallback 任务全部执行完毕后的回调
     */
    public constructor(maxConcurrency: number = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY, runOverCallback: ResultCallback) {
        this.setRunOverCallback(runOverCallback);
        this.setMaxConcurrency(maxConcurrency);
        this.initial();
    }

    private initial(): void {
        this.canAbort = false;
        this.reset();
    }

    /**
     * 添加任务到任务队列, 不会执行
     * @param task 任务
     * @return 是否添加成功, 如果任务处于执行阶段返回 false
     */
    public addTask(task: Task): boolean {
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
    public run(canAbort: boolean = false, ...args: Array<any>): void {
        this.canAbort = canAbort;
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
    private executeSingleTask(...args: Array<any>): void {
        let promise = new Promise<void>((resolve, reject) => {
            let result = this.taskList[this.taskIndex++](resolve, reject, args);
            this.handleResult.push(result);
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
     * @param args 函数执行所需参数
     */
    private judgeExecuteEnd(args: Array<any>): void {
        // 如果全部任务都得到执行, 并且执行没有结束
        // 设置 runOver 的原因是最后几个并发执行的任务在执行完毕后都会
        // 触发该函数, 而 runOverCallback 函数应只执行一次
        if (this.taskIndex >= this.taskList.length && !this.runOver) {
            this.runOver = true;
            let result = this.handleResult;
            Promise.all(this.taskPromiseList).then(() => {
                this.runOverCallback && this.runOverCallback(result);
            }).catch((error) => {
                if(!this.canAbort) {
                    this.runOverCallback && this.runOverCallback(result);
                }
                console.error(error);
            });
            this.reset();
            return;
        }
        this.executeSingleTask(args);
    }

    private reset(): void {
        this.taskList = [];
        this.taskIndex = 0;
        this.taskPromiseList = [];
        this.running = false;
        this.handleResult = [];
    }

    private setRunning(running: boolean): void {
        this.running = running;
    }

    public getRunning(): boolean {
        return this.running;
    }

    /**
     * 设置任务全部执行完毕后的回调函数, 如果队列正在执行则返回 false
     * @param runOverCallback 回调函数
     */
    public setRunOverCallback(runOverCallback: ResultCallback): boolean {
        if(!this.getRunning()) {
            this.runOverCallback = runOverCallback;
            return true;
        }
        return false;
    }

    /**
     * 设置最大并发数, 如果正在执行返回 false
     * @param maxConcurrency 最大并发数, 小于等于 0 时使用默认值
     */
    public setMaxConcurrency(maxConcurrency: number): boolean {
        if(maxConcurrency <= 0) {
            this.maxConcurrency = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY;
        }
        if (!this.getRunning()) {
            this.maxConcurrency = maxConcurrency;
            return true;
        }
        return false;
    }

    public getMaxConcurrency(): number {
        return this.maxConcurrency;
    }
}
```

#### 4. 安装 TypeScript
由于 TypeScript 是运行在 Node.js 上的，所以我们还需要安装 Node.js，安装 Node.js 可前往 [Node.Js 中文网](https://nodejs.p2hp.com/)。

这里仅提供 windows 上的 TypeScript 的安装方式。

首先以管理员的方式进入 cmd（win + R，输入 cmd，然后 ctrl + shift + enter 即可）。

使用以下的命令全局安装：

```shell
npm i -g typescript
```

之后在任意目录下创建一个 `ts` 文件，然后在该文件夹下打开 cmd，执行 `tsc xx.ts` 就会得到一个编译后的 ja 文件。
