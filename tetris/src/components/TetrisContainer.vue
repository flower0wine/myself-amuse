<template>
  <div class="tetris-container" :style="tetrisContainerStyle">
    <div class="tetris-container-left">
      <grid-list/>
    </div>
    <div class="tetris-container-right">
      <tetris-control/>
    </div>
    <div class="game-over-tip" v-if="gameOver">游戏结束</div>
  </div>
</template>

<script setup lang="ts">
import {Tetris} from "@/core";
import {useKeyBoard} from "@/hooks/useKeyBoard";
import TetrisControl from "@/components/control/TetrisControl.vue";
import GridList from "@/components/GridList.vue";
import {
  DOWN_GRID_KEY,
  FLUSH_GRID_GRAPH_KEY,
  INCREASE_CLEAR_LINES_KEY,
  RESET_TETRIS_KEY,
  SET_TETRIS_CONTAINER_HEIGHT_KEY,
  GET_TETRIS_KEY,
  RENDER_NEXT_DOWNING_GRID_KEY,
  CLEAR_DOWN_TIMER_KEY,
  GET_RUNNING_KEY,
  GET_STARTED_KEY,
  SET_HIGHEST_SCORE_KEY, GET_GAME_OVER_KEY
} from "@/constant/keys";
import type { Ref } from 'vue';
import type {GetRunning, GetStarted} from "@/types";
import {onBeforeMount, provide, computed, ref, onMounted, readonly} from "vue";
import {emitter} from "@/util";

const tetris = new Tetris(previewGrid);
const {addEventHandler} = useKeyBoard();
const tetrisContainerHeight = ref(0);
const tetrisContainerStyle = computed(() => {
  return `--height: ${tetrisContainerHeight.value}px;`;
});

const running = ref(false);
const started = ref(false);
const gameOver = ref(false);

function setTetrisContainerHeight(height: number) {
  tetrisContainerHeight.value = height;
}

function addKeyBoardEvent() {
  addEventHandler("ArrowLeft", () => {
    if (!running.value) return;
    tetris.leftMoveGrid();
    flushGridGraph();
  });
  addEventHandler("ArrowRight", () => {
    if (!running.value) return;
    tetris.rightMoveGrid();
    flushGridGraph();
  });
  addEventHandler("ArrowUp", () => {
    if (!running.value) return;
    tetris.rotateGrid();
    flushGridGraph();
  });
  addEventHandler("ArrowDown", () => {
    if (!running.value) return;
    const clearCount = tetris.quickMoveDownGrid();
    increaseClearLines(clearCount);
    flushGridGraph();
    previewGrid();
    checkGameOver();
  });
}

function moveDownGrid(): void {
  if (!running.value) return;
  const {clearCount, collide} = tetris.moveDownGrid();
  if (clearCount > 0) {
    increaseClearLines(clearCount);
  }
  if (collide) {
    previewGrid();
    checkGameOver();
  }
  flushGridGraph();
}

function checkGameOver(): void {
  if (!tetris.getRunnable()) {
    emitter.emit(CLEAR_DOWN_TIMER_KEY);
    emitter.emit(SET_HIGHEST_SCORE_KEY);
    gameOver.value = true;
  }
}

function initTetris() {
  tetris.generateDowningGrid();
  previewGrid();

  tetris.transformNextDowningGrid();
  tetris.generateDowningGrid();
}

function resetTetris() {
  tetris.reset();
  initTetris();
}

function flushGridGraph() {
  emitter.emit(FLUSH_GRID_GRAPH_KEY);
}

function increaseClearLines(clearCount: number): void {
  if (clearCount > 0) {
    emitter.emit(INCREASE_CLEAR_LINES_KEY, clearCount);
  }
}

function previewGrid(): void {
  emitter.emit(RENDER_NEXT_DOWNING_GRID_KEY, tetris.getNextDowningGridInfo());
}

function setRunning(r: boolean): void {
  running.value = r;
  gameOver.value = false;
}

function setStarted(s: boolean): void {
  started.value = s;
}

onBeforeMount(addKeyBoardEvent);
onMounted(initTetris);

provide<Function, Symbol>(SET_TETRIS_CONTAINER_HEIGHT_KEY, setTetrisContainerHeight);
provide<Tetris, Symbol>(GET_TETRIS_KEY, tetris);
provide<Ref, Symbol>(GET_GAME_OVER_KEY, readonly(gameOver));
provide<GetRunning, Symbol>(GET_RUNNING_KEY, {
  running: readonly(running),
  set: setRunning
});
provide<GetStarted, Symbol>(GET_STARTED_KEY, {
  started: readonly(started),
  set: setStarted
});

emitter.on(DOWN_GRID_KEY, moveDownGrid);
emitter.on(RESET_TETRIS_KEY, resetTetris);

</script>

<style scoped lang="scss">
.tetris-container {
  --height: "";
  position: relative;
  display: flex;
  height: var(--height);
  margin-top: 100px;
  margin-inline: auto;
}

.tetris-container-left,
.tetris-container-right {
  height: 100%;
}

.game-over-tip {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  font-weight: 700;
  font-family: "华文楷体", serif;
  color: #ffeb40;
  text-shadow: 1px 1px 1px #0000008f, 2px 2px 2px #00000091, 3px 3px 3px #00000059;
}
</style>