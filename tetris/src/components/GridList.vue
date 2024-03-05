<template>
  <div class="grid-list-container" :style="gridListContainerStyle">
    <div class="grid-list"
         ref="gridList">
    </div>
    <div class="grid-list-bg">
      <div v-for="(item) in gridListBgItemCount"
           class="grid-list-bg-item"
           :key="item"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {inject, ref} from "vue";
import {useCreateGrid} from "@/hooks/useCreateGrid";
import {Tetris} from "@/core";
import {
  FLUSH_GRID_GRAPH_KEY,
  SET_TETRIS_CONTAINER_HEIGHT_KEY,
  GET_TETRIS_KEY
} from "@/constant/keys";
import {emitter} from "@/util";

/**
 * 使用 symbol 传入会报错. 但是 inject 并不支持 inject<Tetris, Symbol> 写法, 只能传入一个 T 泛型
 * */
const tetris = inject<Tetris>(GET_TETRIS_KEY);
const setTetrisContainerHeight = inject<Function>(SET_TETRIS_CONTAINER_HEIGHT_KEY);

const gridSize: number = 24;
const gridList = ref<HTMLDivElement>();
const {render} = useCreateGrid(createGrid, adjustGrid);
const gridListBgItemCount = Tetris.HORIZONTAL_GRID_COUNT * Tetris.VERTICAL_GRID_COUNT;

const gridListContainerStyle = `--grid-size: ${gridSize}px;
  --width: ${gridSize * Tetris.HORIZONTAL_GRID_COUNT}px;`;

function createGrid(x: number, y: number): HTMLDivElement {
  let gridEle = document.createElement("div");
  gridEle.classList.add("grid");
  // gridEle.style.setProperty("--grid-bg-color", `#${Math.random().toString(16).substring(2, 8)}`);
  adjustGrid(gridEle, x, y);
  return gridEle;
}

function adjustGrid(gridEle: HTMLDivElement, x: number, y: number): void {
  gridEle.style.right = x * gridSize + "px";
  gridEle.style.top = y * gridSize + "px";
}

function flushGridGraph(): void {
  render(tetris.getMergedGrid(), Tetris.HORIZONTAL_GRID_COUNT, (grid) => {
    let fragment = document.createDocumentFragment();
    for (let ele of grid) {
      fragment.appendChild(ele);
    }
     gridList.value.innerHTML = "";
    gridList.value.appendChild(fragment);
  });
}

emitter.on(FLUSH_GRID_GRAPH_KEY, flushGridGraph);

setTetrisContainerHeight(gridSize * Tetris.VERTICAL_GRID_COUNT);
</script>

<style lang="scss">
.grid {
  --grid-bg-color: "";
  position: absolute;
  width: var(--grid-size);
  height: var(--grid-size);
  background-color: #f44;
  border-radius: 2px;
  border-top: 3px solid #ffffff50;
  border-left: 3px solid #ffffffad;
  border-right: 3px solid #00000047;
  border-bottom: 3px solid #00000020;
}
</style>

<style scoped lang="scss">
.grid-list-container {
  --grid-size: "";
  --width: "";
  position: relative;
  height: 100%;
  background-color: #383d59;
}

.grid-list {
  position: relative;
  z-index: 1;
  width: var(--width, 300px);
  height: 100%;
}

.grid-list-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.grid-list-bg-item {
  float: left;
  width: var(--grid-size);
  height: var(--grid-size);
  border: 1px solid #1b1b1b26;
}
</style>