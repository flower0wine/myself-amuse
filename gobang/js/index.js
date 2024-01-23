// 使用严格模式
'use strict';

let color = {
    white: "white",
    blank: "blank"
}

/**
 * 默认参数
 */
let defaultOption = {
    lattice: 15,
    gap: 20,
    succeedPieceCount: 5,
    currentPieceColor: color.white,
    getPiecePosition: function (e, gobang) {
        let pieceX = e.pageX - gobang.gobangBoardOffset.x - gobang.gobangBoardBorderWidth;
        let pieceY = e.pageY - gobang.gobangBoardOffset.y - gobang.gobangBoardBorderWidth;
        return {
            pieceX,
            pieceY
        }
    },
    domsName: ["rowLine", "columnLine", "blankPiece", "whitePiece"],
}

/**
 * 五子棋
 */
class Gobang {
    doms;
    // 格子数
    lattice;
    gap;
    // 棋子间距, 头对头, 尾对尾的间距
    pieceStartGap;
    lineShort;
    // 当前棋子颜色
    currentPieceColor;
    // 棋盘相对父元素偏移量
    gobangBoardOffset;
    gobangBoardBorderWidth;
    pieceScale;
    /**
     * 棋子信息, 二维数组
     * @type {[[]]}
     */
    piece;
    // 棋盘上棋子的数量
    pieceCount;
    // 胜利需要的棋子数量
    succeedPieceCount;
    gameOver;
    /**
     * 工具
     * @type {Tools}
     */
    tools;
    /**
     * 自定义获取棋子的坐标
     * @type {function}
     */
    getPiecePosition;

    constructor(option) {
        // 合并参数, 不考虑原型上的属性
        Object.assign(defaultOption, option);
        this.lattice = defaultOption.lattice;
        this.gap = defaultOption.gap;
        this.currentPieceColor = defaultOption.currentPieceColor;
        this.succeedPieceCount = defaultOption.succeedPieceCount;
        this.getPiecePosition = defaultOption.getPiecePosition;
        this.pieceCount = 0;
        this.gameOver = false;
        this.tools = new Tools();
        this.doms = {
            gobangContainer: document.querySelector(".gobang-container"),
            rowLine: document.querySelector(".row-line"),
            columnLine: document.querySelector(".column-line"),
            whitePiece: document.querySelector(".white-piece"),
            blankPiece: document.querySelector(".blank-piece"),
        };
        this.initial();

        console.log(this)
        document.body.style.opacity = '';
    }

    initial() {
        this.initialPieceArray();
        this.setBackground();
        let doms = this.doms;
        let lineShort;
        let gap = this.gap;
        let gobangContainer = doms.gobangContainer;
        let gobangContainerStyle = gobangContainer.style;

        // 获取线条、棋子、棋盘已计算样式
        let rowLineStyle = getComputedStyle(doms.rowLine);
        let pieceComputedStyle = getComputedStyle(doms.whitePiece);
        let gobangContainerComputedStyle = getComputedStyle(doms.gobangContainer);

        // 获取线条粗细、棋子尺寸、棋盘边框粗细
        this.lineShort = lineShort = this.pixelStringToNumber(rowLineStyle.borderWidth);
        this.pieceScale = this.pixelStringToNumber(pieceComputedStyle.width);
        this.gobangBoardBorderWidth = this.pixelStringToNumber(gobangContainerComputedStyle.borderWidth);

        // 计算棋盘的大小, 棋盘的大小随格数改变, gap + lineShort 为格子大小加上线条粗细
        let scale = (gap + lineShort) * this.lattice - lineShort;
        gobangContainerStyle.width = `${scale}px`;
        gobangContainerStyle.height = `${scale}px`;
        gobangContainerStyle.setProperty('--line-long', `${scale}px`);
        // 棋盘的 offset, 点击时要计算棋子的位置
        this.gobangBoardOffset = {
            x: gobangContainer.offsetLeft,
            y: gobangContainer.offsetTop,
        };
        this.pieceStartGap = lineShort + gap;

        // 移除棋盘上的线条和棋子
        defaultOption.domsName.forEach((item) => {
            this.doms[item].remove();
        });

        this.addEvent();
        this.generateLines();
    }

    initialPieceArray () {
        // 初始化棋子数组
        this.piece = new Array(this.lattice - 1);
        for (let index = 0, length = this.piece.length; index < length; index++) {
            this.piece[index] = new Array(this.lattice - 1);
        }
    }

    addEvent() {
        // 给棋盘添加点击事件
        this.doms.gobangContainer.addEventListener("click", this.clickGobangBoard);
    }

    addEventIfGameOver() {
        if(this.gameOver) {
            this.addEvent();
            this.gameOver = false;
        }
    }

    /**
     * 将类似 10px 的字符串转化为 数字 10
     * @param str {string} 格式应为类似 10px 的字符串
     * @return {number} 返回数字, 如 10px 变为数字 10
     */
    pixelStringToNumber(str) {
        return +str.split("px")[0];
    }

    /**
     * 生成棋盘的线条
     */
    generateLines() {
        let length = this.lattice;
        let doms = this.doms;
        let documentFragment = new DocumentFragment();
        // 设置行线
        for (let index = 1; index < length; index++) {
            let rowLine = doms.rowLine.cloneNode();
            rowLine.style.top = `${this.gap * index}px`;
            documentFragment.appendChild(rowLine);
        }
        // 设置列线
        for (let index = 1; index < length; index++) {
            let columnLine = doms.columnLine.cloneNode();
            columnLine.style.left = `${this.gap * index}px`;
            documentFragment.appendChild(columnLine);
        }
        doms.gobangContainer.appendChild(documentFragment);
    }

    /**
     * 设置棋盘的背景
     */
    setBackground() {
        let url = 'images/1.jpg';
        this.doms.gobangContainer.style.backgroundImage = `url(${url})`;
    }

    setLattice(lattice) {
        this.lattice = lattice;
    }

    /**
     * 改变棋子的颜色
     */
    changeColor() {
        this.currentPieceColor = this.currentPieceColor === color.blank ? color.white : color.blank;
    }

    /**
     * 放置棋子, 位置以棋盘左上角为准
     * @param x {number} 横坐标, 对应 left
     * @param y {number} 纵坐标, 对应 top
     * @return {Element} 返回添加的棋子 dom
     */
    putPiece(x, y) {
        let piece = this.doms[`${this.currentPieceColor}Piece`].cloneNode();
        piece.style.top = `${y}px`;
        piece.style.left = `${x}px`;
        this.doms.gobangContainer.appendChild(piece);
        return piece;
    }

    /**
     * 判断棋子的位置, 将棋子放在两条线的交界处
     * @param position {number} 棋子的位置, x 或 y
     * @return {{index: number, position: number}} 返回棋子应在棋盘上的位置, 以及在数组中的索引
     */
    judgePosition(position) {
        let gap = this.gap;
        let pieceStartGap = this.pieceStartGap;
        let halfGap = gap >> 1;
        let start = position - halfGap;
        let startPosition = gap - ((this.pieceScale - this.lineShort) >> 1);
        // 棋子在数组中对应的下标
        let index = (start - (start % pieceStartGap)) / pieceStartGap;
        let minIndex = 0;
        // lattice 是格数, 故减 2
        let maxIndex = this.lattice - 2;
        index = index < minIndex ? minIndex : index;
        index = index > maxIndex ? maxIndex : index;
        let realPosition = startPosition + pieceStartGap * index;
        return {
            position: realPosition,
            index
        };
    }

    /**
     * 递归计数, 当给定索引对应的下一个棋子在数组中存在, 并且颜色与当前棋子颜色相同时继续递归
     * @param piece {{}} 当前棋子
     * @param customGetIndex {function} 自定义获取索引
     * @return {number} 返回当前棋子周边相同颜色的棋子数量
     */
    recursion(piece, customGetIndex) {
        let xIndex = piece.index.x;
        let yIndex = piece.index.y;
        let {nextXIndex, nextYIndex} = customGetIndex(xIndex, yIndex);
        let pieceArr = this.piece;
        if (pieceArr[xIndex][yIndex]) {
            if (!this.checkIndex(nextXIndex) || !this.checkIndex(nextYIndex) || !pieceArr[nextXIndex][nextYIndex] ||
                (pieceArr[nextXIndex][nextYIndex] && pieceArr[nextXIndex][nextYIndex].type !== piece.type)) {
                return 0;
            }
            return this.recursion(pieceArr[nextXIndex][nextYIndex], customGetIndex) + 1;
        } else {
            return 0;
        }
    }

    /**
     * 检查索引是否正确, 范围区间为 [0, this.lattice - 1)
     * @param index {number} 索引
     * @return {boolean} 结果
     */
    checkIndex(index) {
        return index >= 0 && index < this.lattice - 1;
    }

    checkSucceed(piece) {
        let res, leftRes, rightRes;
        // 左右检测
        leftRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: --xIndex,
                nextYIndex: yIndex,
            };
        });
        rightRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: ++xIndex,
                nextYIndex: yIndex,
            };
        });
        res = leftRes + rightRes + 1;
        // 竖直检测
        leftRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: xIndex,
                nextYIndex: --yIndex,
            };
        });
        rightRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: xIndex,
                nextYIndex: ++yIndex,
            }
        });
        res = Math.max(res, leftRes + rightRes + 1);
        // 斜线检测
        leftRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: --xIndex,
                nextYIndex: --yIndex,
            };
        });
        rightRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: ++xIndex,
                nextYIndex: ++yIndex,
            };
        });
        res = Math.max(res, leftRes + rightRes + 1);
        leftRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: --xIndex,
                nextYIndex: ++yIndex,
            };
        });
        rightRes = this.recursion(piece, function (xIndex, yIndex) {
            return {
                nextXIndex: ++xIndex,
                nextYIndex: --yIndex,
            };
        });
        res = Math.max(res, leftRes + rightRes + 1);

        return res >= this.succeedPieceCount;
    }

    /**
     * 点击棋盘, 由于函数中使用到 this, 故使用箭头函数
     * @param e 事件对象
     */
    clickGobangBoard = (e) => {
        let {pieceX, pieceY} = this.getPiecePosition(e, this);
        let judgePieceX = this.judgePosition(pieceX);
        let judgePieceY = this.judgePosition(pieceY);
        let exist = false;
        let succeed = false;
        let pieceObj;
        if (!this.piece[judgePieceX.index][judgePieceY.index]) {
            pieceObj = {
                type: this.currentPieceColor,
                position: {
                    x: judgePieceX.position,
                    y: judgePieceY.position
                },
                index: {
                    x: judgePieceX.index,
                    y: judgePieceY.index,
                }
            };
            this.piece[judgePieceX.index][judgePieceY.index] = pieceObj;
            succeed = this.checkSucceed(pieceObj);
        } else {
            exist = true;
        }
        if (!exist) {
            let pieceDom = this.putPiece(judgePieceX.position, judgePieceY.position);
            this.tools.pushPieceToStack(new Piece(pieceDom, pieceObj));
            this.pieceCount++;
            this.changeColor();
            let draw = this.pieceCount === Math.pow(this.lattice - 1, 2);
            // 平局
            if(draw) {
                this.draw();
            } else if (succeed) {
                this.succeed();
            }
            this.gameOver = succeed || draw;
        }
    }

    restart() {
        this.pieceCount = 0;
        this.currentPieceColor = defaultOption.currentPieceColor;
        this.initialPieceArray();
        this.addEventIfGameOver();
    }

    reset() {
        this.restart();
        gobang.removeAllElement();
        gobang.addInitialElement();
        gobang.initial();
    }

    /**
     * 添加初始化时必要的元素, 用这些元素来初始化数据,
     * 这些元素是页面开始时就有的, 只是保存了起来
     */
    addInitialElement () {
        let doms = this.doms;
        let documentFragment = new DocumentFragment();
        defaultOption.domsName.forEach((item) => {
            documentFragment.appendChild(doms[item]);
        });
        doms.gobangContainer.appendChild(documentFragment);
    }

    /**
     * 移除棋盘中所有的元素,
     * 移除元素时应使用下标, 从后开始遍历, 因为 HTMLCollection 集合具有响应式
     */
    removeAllElement () {
        let gobangContainer = this.doms.gobangContainer;
        let children = gobangContainer.children;
        let length = children.length;
        for (let index = length - 1; index >= 0; index--) {
            children.item(index).remove();
        }
    }

    removeGobangBoardClickEvent() {
        this.doms.gobangContainer.removeEventListener("click", this.clickGobangBoard);
    }

    /**
     * 删除数组中的棋子
     * @param index {{x: number, y: number}} 索引
     */
    removePiece(index) {
        this.pieceCount--;
        this.changeColor();
        this.piece[index.x][index.y] = null;
    }

    /**
     * 平局时的处理函数
     */
    draw() {
        window.alert("平局!");
        this.removeGobangBoardClickEvent();
    }

    succeed() {
        // 由于赢了的时候修改了棋子颜色, 刚好是下一个棋子的颜色, 导致颜色刚好相反, 并且由于赢了的时候可以悔棋, 所以不得不管
        let winPiece = this.currentPieceColor === color.white ? "黑棋" : "白棋";
        window.alert(`${winPiece}胜利!`);
        this.removeGobangBoardClickEvent();
    }
}

class Piece {
    pieceDom;
    /**
     * @type {{index: {x: number, y: number}, position: {x: number, y: number}, type: string}}
     */
    pieceInfo;

    constructor(pieceDom, pieceInfo) {
        this.pieceDom = pieceDom;
        this.pieceInfo = pieceInfo;
    }
}

class Tools {
    doms;
    /**
     * 棋子放置栈, 使用数组
     * @type {[Piece]}
     */
    pieceStack;

    constructor() {
        this.pieceStack = [];
        this.doms = {
            regret: document.querySelector(".regret"),
            reset: document.querySelector(".reset"),
            latticeInput: document.querySelector("#modify-lattice"),
        }
        this.initial();
    }

    initial() {
        this.doms.regret.addEventListener("click", this.popPieceFromStack);
        this.doms.reset.addEventListener("click", this.restartGame);
        this.doms.latticeInput.addEventListener("keyup", this.modifyLattice);
        window.addEventListener("keyup", this.keyupEvent);
    }

    pushPieceToStack (piece) {
        this.pieceStack.push(piece);
    }

    /**
     * 按键弹起事件处理函数
     * @param e 键盘事件对象
     */
    keyupEvent = (e) => {
        let keyZ = "KeyZ";
        if(e.code === keyZ && e.ctrlKey) {
            this.popPieceFromStack();
        }
    }

    popPieceFromStack = () => {
        let piece = this.pieceStack.pop();
        if(piece) {
            let pieceIndex = piece.pieceInfo.index;
            piece.pieceDom.remove();
            gobang.removePiece({x: pieceIndex.x, y: pieceIndex.y});
            gobang.addEventIfGameOver();
        }
    }

    restartGame = () => {
        let confirm = window.confirm("确认重新开始吗?");
        if(confirm) {
            this.restart();
        }
    }

    clearPieceStack() {
        this.pieceStack.forEach((item) => {
            item.pieceDom.remove();
        });
        this.pieceStack = [];
    }

    restart() {
        this.clearPieceStack();
        gobang.restart();
    }

    reset() {
        gobang.reset();
    }

    modifyLattice = (e) => {
        let enterCode = 13;
        if(e.keyCode !== enterCode) {
            return;
        }
        let confirm = window.confirm("设置后将会重新开始游戏!");
        if(!confirm) {
            return;
        }
        let latticeInput = this.doms.latticeInput;
        let lattice = latticeInput.value;
        let reg = /^\d{2,3}$/;
        if(!reg.test(lattice)) {
            window.alert("棋盘个数的格式应为数字!");
            return;
        }
        if(!(10 <= lattice && lattice <= 100)) {
            window.alert("棋盘格数应为 10 ~ 100 之间!");
            return;
        }
        gobang.setLattice(lattice);
        this.reset();
    }

}

let gobang = new Gobang({
    lattice: 15
});