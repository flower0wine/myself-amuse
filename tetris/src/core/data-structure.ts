/* 
  功能描述: 俄罗斯方块的数据结构
  创建时间: 2024年 02月 29日
 */

import type {DowningGrid} from "@/types";

type CollisionDetectFunction = (grid: number[], index: number, startX: number, startY: number, downingGridInfo: DowningGrid) => boolean;

const downDetectFunction: CollisionDetectFunction = (grid, index, startX, startY, downingGridInfo) => {
    // startY 可能为负数, 此时下落中的方块还不在展示区
    if(startY + downingGridInfo.height <= 0) {
        return false;
    }
    const downingGrid = downingGridInfo.downingGrid;
    // 此时下落中的方块部分在展示区, 不在展示区的方块跳过检查
    if(startY < 0 && index < -startY) {
        return false;
    }
    // 检查展示区中的方块
    return (grid[index + startY + 1] & downingGrid[index]) !== 0 || startY + downingGrid.length >= grid.length;
};

export class TetrisDataStructure {
    private readonly horizontalGridCount: number;
    private readonly verticalGridCount: number;
    /**
     * 单行最大数字
     */
    private readonly maxHorizontalNumber: number;
    /**
     * 存储方块的位置信息, 用 1 和 0 分别表示方块的有无, 并且下标 0 表示顶部, 即方块进入的位置
     */
    private readonly grid: number[];

    public constructor(horizontalGridCount: number, verticalGridCount: number) {
        this.horizontalGridCount = horizontalGridCount;
        this.verticalGridCount = verticalGridCount;

        this.maxHorizontalNumber = (1 << this.horizontalGridCount) - 1;
        this.grid = new Array(verticalGridCount).fill(0);
    }

    /**
     * 将 downingGrid 合并到 grid 中
     * @param downingGrid 正在下落中的方块
     * @param startY 方块的右上角纵坐标
     * @return 返回清除的行数, 没有清除方块则返回 0
     */
    public mergeToGrid(downingGrid: number[], startY: number): number {
        const grid = this.grid;
        const length = downingGrid.length + startY;
        for (let i = startY, index = 0; i < length; i++, index++) {
            grid[i] |= downingGrid[index];
        }
        return this.eliminateGrid();
    }

    /**
     * 如果方块占满一行, 则进行消除
     * @return 返回清除的行数
     */
    public eliminateGrid(): number {
        const grid = this.grid;
        const maxHorizontalNumber = this.maxHorizontalNumber;
        let count = 0;
        let eliminate = false;
        let index = grid.length - 1;
        while(index - count >= 0 && grid[index] !== 0) {
            if (grid[index] === maxHorizontalNumber && index - count >= 0) {
                eliminate = true;
                count++;
            } else {
                index--;
            }
            if(eliminate) {
                grid[index] = grid[index - count];
            }
        }
        for(let i = 0; i < index; i++) {
            grid[i] = 0;
        }
        return count;
    }

    /**
     * 下移碰撞检测, 如果将发生碰撞, 会将方块合并到 grid 中, 调用者应清除掉 downingGridInfo 中的方块位置信息
     * @param downingGridInfo 正在下落中的方块信息
     * @param startX 方块的右上角横坐标
     * @param startY 方块的右上角纵坐标
     * @return 返回 true 表示将会发生碰撞, 不能下移
     */
    public moveDownGridCollisionDetect(downingGridInfo: DowningGrid, startX: number, startY: number): boolean {
        return this.collisionDetection(downingGridInfo, startX, startY, downDetectFunction);
    }

    /**
     * 左移碰撞检测
     * @param downingGridInfo 正在下落中的方块信息
     * @param startX 方块的右上角横坐标
     * @param startY 方块的右上角纵坐标
     * @return 返回 true 表示将会发生碰撞, 不能左移
     */
    public leftMoveGridCollisionDetect(downingGridInfo: DowningGrid, startX: number, startY: number): boolean {
        const downingGrid = downingGridInfo.downingGrid;
        const maxNumber = 1 << (this.horizontalGridCount - 1);
        return this.collisionDetection(downingGridInfo, startX, startY, (grid, index) => {
            const gridIndex = (startY < 0 ? 0 : startY) + index;
            return (downingGrid[index] & maxNumber) === maxNumber || (grid[gridIndex] & (downingGrid[index] << 1)) !== 0;
        });
    }

    /**
     * 右移碰撞检测
     * @param downingGridInfo 正在下落中的方块信息
     * @param startX 方块的右上角横坐标
     * @param startY 方块的右上角纵坐标
     * @return 返回 true 表示将会发生碰撞, 不能右移
     */
    public rightMoveGridCollisionDetect(downingGridInfo: DowningGrid, startX: number, startY: number): boolean {
        const downingGrid = downingGridInfo.downingGrid;
        const minNumber = 1;
        return this.collisionDetection(downingGridInfo, startX, startY, (grid, index) => {
            const gridIndex = (startY < 0 ? 0 : startY) + index;
            return (downingGrid[index] & minNumber) === minNumber || (grid[gridIndex] & (downingGrid[index] >> 1)) !== 0;
        });
    }

    /**
     * 碰撞检测, 默认是下落的方块向下移动时进行检测
     * @param downingGridInfo 正在下落中的方块信息
     * @param startX 方块的右上角横坐标
     * @param startY 方块的右上角纵坐标
     * @param detectFn 可自定义检测函数, 默认为检测下落的方块是否与当前方块发生碰撞, 返回 true 表示发生碰撞, 没有传入默认为 {@link downDetectFunction}
     * @return 返回 true 存在碰撞, 返回 false 不存在碰撞
     */
    public collisionDetection(downingGridInfo: DowningGrid, startX: number, startY: number, detectFn: CollisionDetectFunction): boolean {
        const grid = this.grid;
        const downingGrid = downingGridInfo.downingGrid;
        for (let i = 0; i < downingGrid.length; i++) {
            if (detectFn(grid, i, startX, startY, downingGridInfo)) {
                return true;
            }
        }
        return false;
    }

    /**
     * grid 在高度上是否已经爆满
     * @return 返回 true 表示爆满, 返回 false 表示未爆满
     */
    public isFullHeight(): boolean {
        for(let i = 0; i < this.grid.length; i++) {
            if(this.grid[i] === 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * 重置 tetris 数据结构的数据
     */
    public reset(): void {
        this.grid.fill(0);
    }

    public getGrid(): number[] {
        return this.grid;
    }
}

