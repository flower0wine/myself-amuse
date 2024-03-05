/* 
  功能描述: 工具
  创建时间: 2024年 03月 02日
 */

import mitt from "mitt";

export const emitter = mitt();

/**
 * 检查矩阵是否可旋转
 * @param matrix 矩阵
 * @return 是否可旋转
 */
export function checkMatrixRotatable(matrix: Array<Array<Number>>): boolean {
    if (!matrix) {
        return false;
    }
    let rotatable = true;
    const scale = matrix.length;
    // 提供的矩阵区域是否是正方形
    for (let i = 0; i < scale - 1; i++) {
        if (matrix[i].length !== matrix[i + 1].length) {
            rotatable = false;
            break;
        }
    }
    return rotatable;
}

/**
 * 顺时针旋转矩阵
 * @param matrix 矩阵
 * @return 是否可以旋转
 */
export function clockwiseRotateMatrix(matrix: Array<Array<Number>>): boolean {
    if (!checkMatrixRotatable(matrix)) {
        return false;
    }
    const scale = matrix.length;
    const length = scale >> 1;
    for (let row = 0; row < length; row++) {
        for (let col = row; col <= length - row; col++) {
            const temp = matrix[row][col];
            matrix[row][col] = matrix[scale - col - 1][row];
            matrix[scale - col - 1][row] = matrix[scale - row - 1][scale - col - 1];
            matrix[scale - row - 1][scale - col - 1] = matrix[col][scale - row - 1];
            matrix[col][scale - row - 1] = temp;
        }
    }
    return true;
}

/**
 * 逆时针旋转
 * @param matrix 矩阵
 * @return 是否可以旋转
 */
export function anticlockwiseRotateMatrix(matrix: Array<Array<Number>>): boolean {
    if (!checkMatrixRotatable(matrix)) {
        return false;
    }
    const scale = matrix.length;
    const length = scale >> 1;
    for (let row = 0; row < length; row++) {
        for (let col = row; col <= length - row; col++) {
            const temp = matrix[row][col];
            matrix[row][col] = matrix[col][scale - row - 1];
            matrix[col][scale - row - 1] = matrix[scale - row - 1][scale - col - 1];
            matrix[scale - row - 1][scale - col - 1] = matrix[scale - col - 1][row];
            matrix[scale - col - 1][row] = temp;
        }
    }
    return true;
}

export function dimensionOneToTwo(oneDimension: number[], scale: number, maxLength: number): number[][] {
    const arr = new Array(scale).fill(null).map(() => new Array(scale).fill(0));
    const oneDimensionLength = oneDimension.length;
    for (let row = 0; row < oneDimensionLength; row++) {
        const bin = oneDimension[row].toString(2).padStart(maxLength, '0').split('');
        for (let col = 0; col < scale; col++) {
            arr[row][col] = Number(bin[col]);
        }
    }
    return arr;
}

export function dimensionTwoToOne(twoDimension: number[][]): number[] {
    const length = twoDimension.length;
    const arr = new Array(length).fill(0);
    for (let row = 0; row < length; row++) {
        let bin = '';
        for (let col = 0; col < length; col++) {
            bin += twoDimension[row][col];
        }
        arr[row] = parseInt(bin, 2);
    }
    return arr;
}

