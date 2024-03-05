/*
  功能描述: 俄罗斯方块实体类
  创建时间: 2024年 02月 29日
 */

// 使用严格模式
'use strict';

import {TetrisDataStructure} from "@/core/data-structure";
import {getRandomDowningGrid} from "@/core/downing-grid";
import {dimensionTwoToOne, dimensionOneToTwo, clockwiseRotateMatrix, anticlockwiseRotateMatrix} from "@/util";
import type {DowningGrid} from "@/types";

type CollideCallback = () => void;

export class Tetris {
    /**
     * 水平格子数
     */
    public static readonly HORIZONTAL_GRID_COUNT: number = 11;
    /**
     * 竖直格子数
     */
    public static readonly VERTICAL_GRID_COUNT: number = 26;
    /**
     * 俄罗斯方块数据结构
     */
    private readonly tetris: TetrisDataStructure;
    /**
     * 正在下落中的方块
     */
    private downingGridInfo: DowningGrid;
    /**
     * 下一个要下落的方块
     */
    private nextDowningGridInfo: DowningGrid;
    /**
     * downingGrid 右上角横坐标
     */
    private startX: number;
    /**
     * downingGrid 右上角纵坐标
     */
    private startY: number;
    /**
     * 将 grid 和 downingGrid 合并后的数组, 这个数组也是最终参与渲染的数组
     */
    private readonly mergedGrid: number[] = new Array<number>(Tetris.VERTICAL_GRID_COUNT).fill(0);
    /**
     * 碰撞回调
     */
    private readonly collideCallback: CollideCallback;
    /**
     * 是否可运行
     */
    private runnable: boolean = true;
    /**
     * 是否是顺时针旋转
     */
    private clockwiseRotate: boolean = true;

    public constructor(collideCallback: CollideCallback) {
        this.tetris = new TetrisDataStructure(Tetris.HORIZONTAL_GRID_COUNT, Tetris.VERTICAL_GRID_COUNT);
        this.collideCallback = collideCallback;
    }

    /**
     * 检查是否可运行
     */
    private checkOver(): void {
        this.runnable = !(this.startY < 0 && this.tetris.isFullHeight());
    }

    /**
     * 将 {@link DowningGrid.downingGrid downingGrid} 和 {@link Tetris.grid grid} 合并到 {@link mergedGrid} 中
     */
    private mergeToRenderedGrid(): void {
        const downingGridInfo = this.downingGridInfo;
        const downingGrid = downingGridInfo.downingGrid;
        const grid = this.getGrid();
        const downingGridLength = downingGrid.length;
        this.mergedGrid.fill(0);

        // 当方块还未完全展现在面板上
        if (this.startY < 0) {
            let index = 0;
            for (let i = -this.startY; i < downingGridLength; i++) {
                this.mergedGrid[index] = downingGrid[i] | grid[index];
                index++;
            }
            for (; index < this.mergedGrid.length; index++) {
                if (grid[index] === 0) continue;
                this.mergedGrid[index] = grid[index];
            }
        }
        // 当方块完全展现在面板上
        else {
            let index = 0;
            for (; index < this.startY; index++) {
                if (grid[index] === 0) continue;
                this.mergedGrid[index] = grid[index];
            }
            for (let i = 0; i < downingGrid.length; i++) {
                this.mergedGrid[index] = downingGrid[i] | grid[index];
                index++;
            }
            for (; index < this.mergedGrid.length; index++) {
                if (grid[index] === 0) continue;
                this.mergedGrid[index] = grid[index];
            }
        }
    }

    /**
     * 随机生成下落的方块, 并赋值给下一个要下落的方块 {@link nextDowningGridInfo}
     */
    public generateDowningGrid(): void {
        if (!this.runnable) return;
        this.nextDowningGridInfo = getRandomDowningGrid();
    }

    /**
     * 左移方块
     */
    public leftMoveGrid(): void {
        if (!this.runnable) return;
        const downingGrid = this.downingGridInfo.downingGrid;
        const collide = this.tetris.leftMoveGridCollisionDetect(this.downingGridInfo, this.startX, this.startY);
        if (collide) {
            return;
        }
        this.startX++;
        Tetris.leftMove(downingGrid);
        this.mergeToRenderedGrid();
    }

    /**
     * 右移方块
     */
    public rightMoveGrid(): void {
        if (!this.runnable) return;
        const downingGrid = this.downingGridInfo.downingGrid;
        const collide = this.tetris.rightMoveGridCollisionDetect(this.downingGridInfo, this.startX, this.startY);
        if (collide) {
            return;
        }
        this.startX--;
        Tetris.rightMove(downingGrid);
        this.mergeToRenderedGrid();
    }

    private static leftMove(grid: number[], count: number = 1) {
        for (let i = 0; i < grid.length; i++) {
            grid[i] <<= count;
        }
    }

    private static rightMove(grid: number[], count: number = 1) {
        for (let i = 0; i < grid.length; i++) {
            grid[i] >>= count;
        }
    }

    /**
     * 下移一格正在下落的方块
     * @return 返回一个对象, 属性如下
     * clearCount: 如果可以消除方块, 则返回消除的行数, 否则返回 0
     * collide: 是否发生碰撞, 碰撞返回 true, 否则返回 false
     */
    public moveDownGrid(): { clearCount: number, collide: boolean } {
        const returnVal = {clearCount: 0, collide: false};
        if (!this.runnable) return returnVal;
        const collide = this.tetris.moveDownGridCollisionDetect(this.downingGridInfo, this.startX, this.startY);
        if (!collide) {
            this.startY++;
            this.mergeToRenderedGrid();
            return returnVal;
        }
        const clearCount = this.mergeToGrid();
        this.downGridOver();
        returnVal.clearCount = clearCount;
        returnVal.collide = true;
        return returnVal;
    }

    /**
     * 快速下落, 直到发生碰撞
     * @return 如果可以消除方块, 则返回消除的行数, 否则返回 0
     */
    public quickMoveDownGrid(): number {
        if (!this.runnable || !this.downingGridInfo) return 0;
        while (!this.tetris.moveDownGridCollisionDetect(this.downingGridInfo, this.startX, this.startY)) {
            this.startY++;
        }
        const clearCount = this.mergeToGrid();
        this.gridMergeToRenderedGrid();
        this.downGridOver();
        return clearCount;
    }

    /**
     * 正在下落的方块下落完成
     */
    private downGridOver(): void {
        this.transformNextDowningGrid();
        this.generateDowningGrid();
        this.collideCallback();
    }

    /**
     * 旋转矩阵
     * @param matrix 矩阵
     */
    private rotateMatrix(matrix: number[][]): void {
        if (this.clockwiseRotate) {
            clockwiseRotateMatrix(matrix);
        } else {
            anticlockwiseRotateMatrix(matrix);
        }
    }

    /**
     * 检查下落的方块是否左右越界, 如果左边越界返回正数, 右边越界返回负数, 否则返回 0
     */
    private checkGridCrossLeftRightBoundary(): number {
        let horizontalDifference: number;
        let crossBoundary: boolean;
        if (this.clockwiseRotate) {
            const h = this.downingGridInfo.height;
            const temp = this.startX + h - Tetris.HORIZONTAL_GRID_COUNT;
            crossBoundary = temp > 0;
            horizontalDifference = crossBoundary ? temp : 0;
        } else {
            const h = this.downingGridInfo.height;
            const temp = this.startX - h;
            crossBoundary = temp < 0;
            horizontalDifference = crossBoundary ? temp : 0;
        }
        return horizontalDifference;
    }

    /**
     * 旋转方块
     */
    public rotateGrid(): void {
        if (!this.runnable) return;
        const downingGridInfo = this.downingGridInfo;
        const downingGrid = downingGridInfo.downingGrid;

        // 这里拆成这个样子是因为 const width = downingGridInfo.height 会有警告, 所以我选择这种写法
        const w = downingGridInfo.width;
        const h = downingGridInfo.height;
        const scale = Math.max(downingGridInfo.width, downingGridInfo.height);
        const twoDimension = dimensionOneToTwo(downingGrid, scale, this.startX + scale);
        this.rotateMatrix(twoDimension);
        let oneDimension = dimensionTwoToOne(twoDimension);

        // 有些方块不是正方形矩阵, 所以旋转后需要去掉为 0 的项
        if (h > w) {
            let start = 0, end = oneDimension.length - 1;
            while (start < oneDimension.length && oneDimension[start] === 0) {
                start++;
            }
            while (end > start && oneDimension[end] === 0) {
                end--;
            }
            oneDimension = oneDimension.slice(start, end + 1);
        }

        this.startX -= this.checkGridCrossLeftRightBoundary();

        // 旋转后移动到原来的位置
        Tetris.leftMove(oneDimension, this.startX);

        const info: DowningGrid = {
            downingGrid: oneDimension,
            width: h,
            height: w
        };
        const collide = this.tetris.collisionDetection(info, this.startX, this.startY, (grid, index) => {
            return (grid[index + this.startY + 1] & oneDimension[index]) !== 0 || this.startY + w >= Tetris.VERTICAL_GRID_COUNT;
        });
        // 如果没有碰撞, 说明这次的旋转可以采用
        if (!collide) {
            downingGridInfo.width = h;
            downingGridInfo.height = w;
            downingGridInfo.downingGrid = oneDimension;
        }
        this.mergeToRenderedGrid();
    }

    /**
     * 将 {@link Tetris.grid grid} 直接合并到 {@link mergedGrid} 中
     */
    private gridMergeToRenderedGrid(): void {
        const grid = this.getGrid();
        for (let i = 0; i < this.mergedGrid.length; i++) {
            this.mergedGrid[i] = grid[i];
        }
    }

    /**
     * 将 {@link downingGridInfo} 的属性 {@link DowningGrid.downingGrid downingGrid} 合并到 {@link mergedGrid} 中
     */
    private mergeToGrid(): number {
        const clearCount = this.tetris.mergeToGrid(this.downingGridInfo.downingGrid, this.startY);
        this.checkOver();
        return clearCount;
    }

    private clearMergedGrid(): void {
        for (let i = 0; i < this.mergedGrid.length; i++) {
            this.mergedGrid[i] = 0;
        }
    }

    /**
     * 将 {@link nextDowningGridInfo} 转移到 {@link downingGridInfo} 中
     */
    public transformNextDowningGrid(): void {
        this.downingGridInfo = this.nextDowningGridInfo;
        const downingGridInfo = this.downingGridInfo;
        const downingGrid = downingGridInfo.downingGrid;
        this.startX = (Tetris.HORIZONTAL_GRID_COUNT >> 1) - (downingGridInfo.width >> 1);
        this.startY = -downingGridInfo.height;
        for (let i = 0; i < downingGrid.length; i++) {
            downingGrid[i] <<= this.startX;
        }
    }

    public reset(): void {
        this.clearMergedGrid();
        this.tetris.reset();
        this.runnable = true;
    }

    public getRunnable(): boolean {
        return this.runnable;
    }

    public getNextDowningGridInfo(): DowningGrid {
        return this.nextDowningGridInfo;
    }

    private getGrid(): number[] {
        return this.tetris.getGrid();
    }

    public getMergedGrid(): number[] {
        return this.mergedGrid;
    }
}