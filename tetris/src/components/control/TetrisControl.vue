<script setup lang="ts">
import TetrisInfo from "@/components/control/TetrisInfo.vue";
import type { Ref } from 'vue';
import type {GetRunning, GetStarted} from "@/types";
import {inject} from "vue";
import {emitter} from "@/util";
import {
  CLEAR_DOWN_TIMER_KEY,
  DOWN_GRID_KEY,
  FLUSH_GRID_GRAPH_KEY, GET_GAME_OVER_KEY, GET_RUNNING_KEY, GET_STARTED_KEY,
  GET_TETRIS_KEY, RENDER_NEXT_DOWNING_GRID_KEY,
  RESET_TETRIS_CONTROL_INFO_KEY,
  RESET_TETRIS_KEY, SET_DOWN_INTERVAL_KEY
} from "@/constant/keys";
import {Tetris} from "@/core";

const tetris = inject<Tetris>(GET_TETRIS_KEY);
const {running, set: setRunning} = inject<GetRunning>(GET_RUNNING_KEY);
const {started, set: setStarted} = inject<GetStarted>(GET_STARTED_KEY);
const gameOver = inject<Ref>(GET_GAME_OVER_KEY);
const minInterval = 300;
const maxInterval = 800;

let interval: number = 800;
let timer: number;

function run(): void {
  clearTimer();
  timer = window.setInterval(() => {
    emitter.emit(DOWN_GRID_KEY);
  }, interval);
}

function clearTimer(): void {
  window.clearInterval(timer);
}

/**
 * 增加下落方块每次下落的时间间隔, 可以为负数, 负数加速, 正数减速, 最小时间为 {@link minInterval}, 最大时间为 {@link maxInterval}
 * @param incr 增量
 */
function addDownInterval(incr: number): void {
  if(interval + incr < minInterval || interval + incr > maxInterval) {
    return;
  }
  interval += incr;
  run();
}

function previewGrid(): void {
  emitter.emit(RENDER_NEXT_DOWNING_GRID_KEY, tetris.getNextDowningGridInfo());
}

function startGame() {
  if(!started.value) {
    previewGrid();
  }
  run();
  setRunning(true);
  setStarted(true);
}

function pauseGame(): void {
  if(gameOver.value) {
    return;
  }
  setRunning(false);
  clearTimer();
}

function continueGame() {
  if(!gameOver || gameOver.value) {
    return;
  }
  setRunning(true);
  run();
}

function restart() {
  setRunning(false);
  setStarted(false);
  emitter.emit(RESET_TETRIS_KEY);
  emitter.emit(RESET_TETRIS_CONTROL_INFO_KEY);
  emitter.emit(FLUSH_GRID_GRAPH_KEY);
}

emitter.on(SET_DOWN_INTERVAL_KEY, addDownInterval);
emitter.on(CLEAR_DOWN_TIMER_KEY, clearTimer);
</script>

<template>
  <div class="tetris-control-container">
    <div class="tetris-title">俄罗斯方块</div>
    <div class="tetris-info">
      <tetris-info/>
    </div>
    <div class="tetris-control">
      <template v-if="!started && !running">
        <div class="start control" @click="startGame">
          <span class="word">开始游戏</span>
        </div>
      </template>
      <template v-else>
        <template v-if="running">
          <div class="pause control" @click="pauseGame">
            <span class="word">暂停游戏</span>
          </div>
        </template>
        <template v-else>
          <div class="continue control" @click="continueGame">
            <span class="word">继续游戏</span>
          </div>
        </template>
        <template v-if="started">
          <div class="restart control" @click="restart">
            <span class="word">重新开始</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tetris-control-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 170px;
  height: 100%;
  padding: 20px 10px;
  background-image: -webkit-linear-gradient(left, #4f4f4f 3%, #727272 8%, #858285 30%, #858285 61%, #727272 92%, #4f4f4f 97%);
}

.tetris-title {
  width: 100px;
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: 700;
  color: #c58818;
  font-family: "华文楷体", serif;
}

.tetris-info {
  margin-bottom: 10px;
}


$button: start #c38f05, pause #909091, restart #bc3b2c, continue #11c342;
$levelOne: 10%;
$levelTwo: 23%;
$darkenVal: 5%;

@each $key, $value in $button {
  .#{$key} {
    border-top: 4px solid lighten($value, $levelTwo);
    border-left: 4px solid lighten($value, $levelOne);
    border-right: 4px solid darken($value, $levelOne);
    border-bottom: 4px solid darken($value, $levelTwo);
    background-color: $value;

    &:hover {
      background-color: darken($value, $darkenVal);
      border-top: 4px solid lighten($value, $levelTwo - $darkenVal);
      border-left: 4px solid lighten($value, $levelOne - $darkenVal);
      border-right: 4px solid darken($value, $levelOne + $darkenVal);
      border-bottom: 4px solid darken($value, $levelTwo + $darkenVal);
    }
  }
}

.control {
  padding: 5px 8px;
  margin: 10px 0;
  border-radius: 4px;
  color: #fff;
  box-shadow: 1px 1px 1px 1px #0000006e, 2px 2px 2px 2px #00000024;
  cursor: pointer;
  user-select: none;
  transition: transform 200ms;

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 1px 1px #0000006e;
  }
}

.control .word {
  margin-left: 6px;
}
</style>