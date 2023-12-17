"use strict";
/*
  功能描述:
  创建时间: 2023年 12月 17日
 */
let callback = (result) => {
    console.log(result);
};
let concurrencyTask = new ConcurrencyTask(1, callback);
concurrencyTask.addTask((resolve, reject) => {
    setTimeout(() => {
        console.log("2秒后");
        resolve();
    }, 2000);
});
concurrencyTask.addTask((resolve, reject) => {
    setTimeout(() => {
        console.log("4秒后");
        resolve();
    }, 2000);
});
concurrencyTask.run(false);
//# sourceMappingURL=index.js.map