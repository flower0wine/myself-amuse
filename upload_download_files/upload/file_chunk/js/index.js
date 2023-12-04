/**
 * 功能描述：文件分片上传与下载
 * 创建日期：2023 年 11 月 22 日
 */

// 使用严格模式
'use strict';

// 对应着 doms
const types = ["addIconContainer", "uploadProgressContainer", "uploadedContainer"];

// 上传的三种状态
const PRE_UPLOAD = 0;
const UPLOADING = 1;
const UPLOADED = 2;

// 单个分片大小
let chunkSize = 1024 * 1024;
// 上传的文件的 API 接口
const PRE_UPLOAD_URL = "http://localhost:9090/huadiao/file/preupload";
const UPLOAD_URL = "http://localhost:9090/huadiao/file/upload";
const UPLOADED_URL = "http://localhost:9090/huadiao/file/uploaded";
const CANCEL_UPLOAD_URL = "http://localhost:9090/huadiao/file/cancel";

const UPLOADING_CLASSNAME = "uploading";
const WAIT_MERGE = "wait-merge";

class FileUploader {
    doms;
    /**
     * 要上传的文件
     * @type {FileList}
     */
    files;
    /**
     * 服务器给文件的名字
     * @type {string}
     */
    filename;
    /**
     * 请求队列, 保存着中断请求函数, 以及它对应的分片索引
     * @type {[{xh: function, index: number}]}
     */
    requestArray;
    /**
     * 当前请求进度
     * @type {number}
     */
    progress;
    /**
     * 如果有暂停, 该值会记录下来, 然后与 progress 结合
     * @type {number}
     */
    preProgress;
    /**
     * 剩余进度, 百分比形式保存
     * @type {number}
     */
    remainProgressPercent;
    /**
     * 任务队列
     * @type {TaskQueue}
     */
    taskQueue;
    /**
     * 被中断的任务对应的索引
     * @type {[number]}
     */
    cancelChunkIndex;

    constructor() {
        this.initial();
    }

    initial() {
        this.doms = {
            fileInput: document.querySelector("#file-input"),
            dragContainer: document.querySelector(".drag-container"),
            addIconContainer: document.querySelector(".add-icon-container"),
            iconBox: document.querySelector(".icon-box"),
            pauseBox: document.querySelector(".pause"),
            startBox: document.querySelector(".start"),
            cancelBox: document.querySelector(".cancel"),
            uploadProgressContainer: document.querySelector(".upload-progress-container"),
            progressContainer: document.querySelector(".progress-container"),
            progressThumb: document.querySelector(".progress-thumb"),
            progressLight: document.querySelector(".progress-light"),
            progressNumber: document.querySelector(".progress-percent"),
            startBtn: document.querySelector(".start"),
            pauseBtn: document.querySelector(".pause"),
            cancelBtn: document.querySelector(".cancel"),
            uploadTools: document.querySelector(".upload-tools"),
            uploadedContainer: document.querySelector(".uploaded-container"),
            uploadedIcon: document.querySelector(".uploaded-icon"),
            uploadAgainIconContainer: document.querySelector(".upload-again-icon-container"),
            uploadAgainContainer: document.querySelector(".upload-again-container"),
        };

        this.addIcon();
        this.addEvent();

        this.changeDragBoard(PRE_UPLOAD);
        this.requestArray = [];
        this.preProgress = 0;
        this.remainProgressPercent = 1;
        this.cancelChunkIndex = [];
        this.taskQueue = new TaskQueue();
    }

    /**
     * 改变上传的展示面板, 有三种: <br/>
     * 1. 还未上传文件
     * 2. 上传文件中
     * 3. 上传文件完成
     * @param index {number} 使用下标改变
     */
    changeDragBoard(index) {
        let doms = this.doms;
        for (let domStr of types) {
            doms[domStr].remove();
        }
        doms.dragContainer.appendChild(doms[types[index]]);
    }

    /**
     * 设置进度
     * @param progress {number} 进度, 0 ~ 100
     */
    setProgress(progress) {
        let doms = this.doms;
        let resProgress = progress.toFixed(2);
        doms.progressThumb.style.transform = `translateX(-${100 - resProgress}%)`;
        doms.progressNumber.innerText = resProgress;
    }

    clickToPause = () => {
        this.abortRequest();
        this.preProgress = this.progress;
        this.remainProgressPercent = (100 - this.preProgress) / 100;
        this.doms.uploadProgressContainer.classList.remove(UPLOADING_CLASSNAME);
    }

    clickToStart = () => {
        this.doms.uploadProgressContainer.classList.add(UPLOADING_CLASSNAME);
        this.preUpload(this.files[0]);
    }

    clickToCancel = () => {
        this.abortRequest();
        this.cancelUpload();
    }

    /**
     * 终止请求
     */
    abortRequest() {
        for (let request of this.requestArray) {
            let {abort, index} = request;
            abort();
            this.cancelChunkIndex.push(index);
        }
        this.requestArray = [];
    }

    /**
     * 添加 svg 图标
     */
    addIcon() {
        let doms = this.doms;
        doms.iconBox.innerHTML = svg.upload;
        doms.startBox.innerHTML = svg.start;
        doms.pauseBox.innerHTML = svg.pause;
        doms.cancelBox.innerHTML = svg.cancel;
        doms.uploadedIcon.innerHTML = svg.uploaded;
        doms.uploadAgainIconContainer.innerHTML = svg.uploadAgain;
    }

    addEvent() {
        let doms = this.doms;
        doms.fileInput.addEventListener("change", this.fileInputChange);
        doms.addIconContainer.addEventListener("dragenter", this.dragenterDragContainer);
        doms.addIconContainer.addEventListener("dragover", this.dragoverDragContainer);
        doms.addIconContainer.addEventListener("drop", this.dropDragContainer);
        doms.addIconContainer.addEventListener("click", this.clickAddIconContainer);
        doms.startBtn.addEventListener("click", this.clickToStart);
        doms.pauseBtn.addEventListener("click", this.clickToPause);
        doms.cancelBtn.addEventListener("click", this.clickToCancel);
        doms.uploadAgainContainer.addEventListener("click", this.clickToUploadAgain);
    }

    /**
     * 上传前, 预热
     * @param file {File} 要上传的文件
     */
    preUpload(file) {
        this.request({
            url: PRE_UPLOAD_URL,
            params: {
                filename: file.name,
                size: file.size,
            },
        }).then((response) => {
            // filename 是服务端给文件的标识, size 是一个分片的大小(字节), chunkIndex 是已经上传的分片索引数组
            let {filename, size, chunkIndex} = response.data;
            this.filename = filename;
            chunkSize = size;
            this.uploadFile(file, chunkIndex);
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * 上传文件, 实现断点续传, 可暂停
     * @param file {File} 要上传的文件
     * @param chunkIndex {[number]} 服务器给的未上传的分片索引
     */
    uploadFile(file, chunkIndex) {
        let chunkArr = this.createChunk(file, chunkIndex);
        this.changeDragBoard(UPLOADING);
        let filename = this.filename;
        let itemArr = new Array(chunkArr.length);
        let chunkArrLength = chunkArr.length;
        let requestArray = this.requestArray;

        chunkArr.forEach((item, index) => {
            // 添加任务
            this.taskQueue.addTask((resolve, reject) => {
                let size = item.file.size;
                let chunkIndex = item.index;
                let requestItem;
                this.request({
                    url: UPLOAD_URL,
                    method: "post",
                    params: {
                        index: chunkIndex,
                        name: filename,
                        size,
                    },
                    data: {
                        file: chunkArr[index].file,
                    },
                    progressHandler: (e) => {
                        // 每个分片的上传进度
                        itemArr[index] = e.loaded / e.total * 100;
                        // 分片进度之和 (可能大于 100, 正常)
                        let sum = itemArr.reduce((pre, cur) => pre + cur, 0);
                        // 计算总进度, 如果之前暂停过, preProgress 不为 0, sum / chunkArrLength 会达到百分之一百
                        // 如果暂停过, 需要计算未上传的部分的进度, 这就是 remainProgressPercent 的作用
                        let progress = this.progress = (sum / chunkArrLength * this.remainProgressPercent) + this.preProgress;
                        this.setProgress(progress);
                    },
                    abortHandler(abort) {
                        requestItem = {abort, index: chunkIndex};
                        requestArray.push(requestItem);
                    }
                }).then(() => {
                    resolve();
                    // 请求完成后删除请求数组中的对象
                    requestArray.splice(requestArray.indexOf(requestItem), 1);
                }).catch(() => {
                    // 请求中断
                    reject();
                });
            });
        });
        // 添加上传完成回调
        this.taskQueue.setRunOverCallback(() => {
            this.doms.uploadProgressContainer.classList.add(WAIT_MERGE);
            this.uploaded(filename);
        });
        this.taskQueue.run();
    }

    /**
     * 上传完成, 请求服务器合并分片
     */
    uploaded() {
        let filename = this.filename;
        this.request({
            url: UPLOADED_URL,
            params: {
                name: filename
            }
        }).then(() => {
            this.changeDragBoard(UPLOADED);
            this.reset();
        }).catch((error) => {
            console.log(error);
        });
    }

    cancelUpload() {
        this.request({
            url: CANCEL_UPLOAD_URL,
            params: {
                name: this.filename,
            }
        }).then(() => {
            this.reset();
            this.changeDragBoard(PRE_UPLOAD);
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * 请求封装
     */
    request({url, method = "get", params, data, progressHandler, abortHandler}) {
        return new Promise((resolve, reject) => {
            let xh = new XMLHttpRequest();
            let paramArr = [];
            // 收集 params
            for (let key in params) {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    paramArr.push(`${key}=${params[key]}`);
                }
            }
            if (paramArr.length !== 0) {
                url += `?${paramArr.join("&")}`;
            }
            xh.open(method, url);
            // 收集 data
            let formData = new FormData();
            for (let key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    formData.append(key, data[key]);
                }
            }
            // 上传完成
            xh.onload = (e) => {
                resolve(JSON.parse(xh.responseText));
            };
            // 产生错误
            xh.onerror = (e) => {
                reject(e);
            };
            // 请求监控
            xh.upload.onprogress = (e) => {
                progressHandler && progressHandler(e);
            };
            // 中断请求
            xh.onabort = (e) => {
                reject(e);
            };
            // 请求终止处理
            abortHandler && abortHandler(() => {
                xh.abort();
            });
            // cookie 跨域
            xh.withCredentials = true;
            xh.send(formData);
        });
    }

    /**
     * 将文件分片处理, 根据是否服务端给的分片索引, 以及取消上传的分片索引获取还未上传的分片索引
     * @param file {File} 要分片的文件
     * @param chunkIndex {[number]} 服务端给的已上传的分片索引数组
     * @return {[{file: File, index: number}]} 返回对象数组, 对象中包括分片后的 Blob 以及该分片在文件中的位置, 也就是索引
     */
    createChunk(file, chunkIndex) {
        const chunkArr = [];
        const size = file.size;
        let start = 0;
        // 分片的索引
        let index = 0;
        // cancelChunkIndex 是取消上传的分片的索引数组, 在暂停时取消的请求, 其代表的分片索引会存在其中, 下次重传
        // 如果服务端有这个索引, 则将其过滤掉
        chunkIndex = chunkIndex.filter((item) => !this.cancelChunkIndex.includes(item));
        this.cancelChunkIndex = [];
        while (start < size) {
            // 如果分片已经上传, 则跳过
            if (chunkIndex.includes(index)) {
                start += chunkSize;
                index++;
                continue;
            }
            // chunkSize 是每个分片的大小, 以字节为单位, 我设置的是 1M, 1<<20 字节
            let end = start + chunkSize;
            // 添加分片
            chunkArr.push({
                file: file.slice(start, end),
                index,
            });
            start = end;
            index++;
        }
        return chunkArr;
    }

    clickToUploadAgain = () => {
        this.doms.fileInput.value = null;
        this.changeDragBoard(PRE_UPLOAD);
    }

    /**
     * fileInput 选择文件后
     */
    fileInputChange = () => {
        let doms = this.doms;
        let fileInput = doms.fileInput;
        this.files = fileInput.files;
        this.preUpload(this.files[0]);
    }

    dragenterDragContainer(e) {
        e.preventDefault();
    }

    dragoverDragContainer(e) {
        e.preventDefault();
    }

    dropDragContainer = (e) => {
        e.preventDefault();
        this.files = e.dataTransfer.files;
        this.preUpload(this.files[0]);
    }

    clickAddIconContainer = () => {
        this.doms.fileInput.click();
    }

    /**
     * 重置
     */
    reset() {
        let doms = this.doms;
        this.setProgress(0);
        this.requestArray = [];
        this.files = null;
        this.filename = "";
        this.remainProgressPercent = 1;
        this.progress = this.preProgress = 0;
        doms.uploadProgressContainer.classList.remove(WAIT_MERGE);
        doms.uploadTools.classList.add(UPLOADING_CLASSNAME);
    }
}

let fileUploader = new FileUploader();















