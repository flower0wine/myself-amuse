/* 
  功能描述: tetris Hook
  创建时间: 2024年 03月 01日
 */

type CreateGridFunction = (x: number, y: number) => HTMLDivElement;

type AdjustGridFunction = (gridEle: HTMLDivElement, x: number, y: number) => void;

type RenderHandler<T> = (grid: Array<HTMLDivElement>) => T;

interface UseTetrisReturn<T> {
    render: (grid: Array<Number>, length: number, handler: RenderHandler<T>) => T
}

/**
 * 渲染俄罗斯方块
 * @param createGrid 创建格子的函数
 * @param adjustGrid 调整格子位置的函数
 * @return 返回一个对象，包含 render 渲染函数
 */
export function useCreateGrid<T>(createGrid: CreateGridFunction, adjustGrid: AdjustGridFunction): UseTetrisReturn<T> {
    const gridPool: HTMLDivElement[] = [];

    function render(grid: Array<Number>, length: number, handler: RenderHandler<T>): T {
        let index = 0;
        const renderedGrid = [];

        for (let i = 0; i < grid.length; i++) {
            let d = 1;
            for (let j = 0; j < length; j++) {
                if ((grid[i] & d) !== 0) {
                    let gridEle = gridPool[index++];
                    if(!gridEle) {
                        gridEle = createGrid(j, i);
                        gridPool.push(gridEle);
                    } else {
                        adjustGrid(gridEle, j, i);
                    }
                    renderedGrid.push(gridEle);
                }
                d <<= 1;
            }
        }
        return handler(renderedGrid);
    }

    return {
        render
    }
}