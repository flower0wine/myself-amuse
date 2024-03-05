<script setup lang="ts">
import type {DowningGrid} from "@/types";
import InfoBox from "@/components/control/InfoBox.vue";
import {onBeforeMount, ref} from "vue";
import {emitter} from "@/util";
import {
  INCREASE_CLEAR_LINES_KEY,
  RENDER_NEXT_DOWNING_GRID_KEY,
  RESET_TETRIS_CONTROL_INFO_KEY, SET_DOWN_INTERVAL_KEY,
  SET_HIGHEST_SCORE_KEY
} from "@/constant/keys";
import {Tetris} from "@/core";
import {useCreateGrid} from "@/hooks/useCreateGrid";

const gridSize: number = 16;
const HIGHEST_SCORE_KEY = "highestScore";

const level = ref(1);
const clearOfLines = ref(0);
const score = ref(0);
const highestScore = ref(0);
const previewGridBox = ref(null);
const levelScore = 5;
const lineScore = 10;

const nextGridBoxStyle = `--grid-size: ${gridSize}px;
  --width: ${gridSize * Tetris.HORIZONTAL_GRID_COUNT}px;`;
const {render} = useCreateGrid(createGrid, adjustGrid);

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

function increaseClearLines(lines: number): void {
  // !(lines > 0) 可以包含 lines 为 NaN 的情况
  if(!(lines > 0)) {
    throw `传入的 lines 为 ${lines}, 应大于 0`;
  }
  clearOfLines.value += lines;

  const lv = Math.ceil(clearOfLines.value / 30);
  if(lv === level.value + 1) {
    level.value = lv;
    emitter.emit(SET_DOWN_INTERVAL_KEY, -150);
  }

  let sum = 0;
  let lvScore = levelScore;
  let liScore = 1;
  for(let i = 1; i <= lines; i++, lvScore += levelScore, liScore = lineScore * i) {
    sum += lv * lvScore + i * liScore;
  }
  score.value += sum;
}

function setHighestScore(): void {
  if(score.value > highestScore.value) {
    localStorage.setItem(HIGHEST_SCORE_KEY, score.value.toString());
  }
}

function getHighestScore(): void {
  const score = localStorage.getItem(HIGHEST_SCORE_KEY);
  if(score) {
    highestScore.value = parseInt(score);
  }
}

function reset(): void {
  clearOfLines.value = 0;
  level.value = 1;
  highestScore.value = score.value;
  score.value = 0;
}

function renderNextGrid(grid: DowningGrid) {
  render(grid.downingGrid, Math.max(grid.width, grid.height), (renderedGrid) => {
    let fragment = document.createDocumentFragment();
    for (let ele of renderedGrid) {
      fragment.appendChild(ele);
    }
    previewGridBox.value.style.width = `${gridSize * grid.width}px`;
    previewGridBox.value.style.height = `${gridSize * grid.height}px`;
    previewGridBox.value.innerHTML = "";
    previewGridBox.value.appendChild(fragment);
  });
}

onBeforeMount(getHighestScore);

emitter.on(RENDER_NEXT_DOWNING_GRID_KEY, renderNextGrid);
emitter.on(INCREASE_CLEAR_LINES_KEY, increaseClearLines);
emitter.on(SET_HIGHEST_SCORE_KEY, setHighestScore);
emitter.on(RESET_TETRIS_CONTROL_INFO_KEY, reset);
</script>

<template>
  <info-box title="级别">
    <template #default>
      <div class="word">{{level}}</div>
    </template>
  </info-box>
  <div class="split"></div>
  <info-box title="消除行数">
    <template #default>
      <div class="word">{{ clearOfLines }}</div>
    </template>
  </info-box>
  <div class="split"></div>
  <info-box title="得分">
    <template #default>
      <div class="word">{{score}}</div>
    </template>
  </info-box>
  <div class="split"></div>
  <info-box title="最高分数">
    <template #default>
      <div class="word">{{highestScore}}</div>
    </template>
  </info-box>
  <div class="split"></div>
  <info-box title="下一个方块">
    <template #default>
      <div class="next-grid-box">
        <div class="next-grid-list"
             :style="nextGridBoxStyle"
             ref="previewGridBox"></div>
      </div>
    </template>
  </info-box>
</template>

<style lang="scss">
.next-grid-list .grid {
  box-shadow: 1px 1px 1px 1px #0000001f;
}
</style>

<style scoped lang="scss">
.split {
  height: 5px;
}

.word {
  padding: 3px 10px;
}

.next-grid-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  .next-grid-list {
    position: relative;
  }
}

</style>