/* 
  功能描述: 存储全局事件的 key
  创建时间: 2024年 03月 04日
 */
"use strict";


// ===========================  localStorage Key  ===========================
import type {InjectionKey, Ref} from "vue";
import type {GetRunning, GetStarted} from "@/types";
import {Tetris} from "@/core";

/**
 * 设置最高得分
 */
export const SET_HIGHEST_SCORE_KEY = "setHighestScore";


// ===========================  Vue3 Provide-Inject Key  ===========================
/**
 * 获取 tetris
 */
export const GET_TETRIS_KEY: InjectionKey<Tetris> = Symbol();
/**
 * 设置 tetris-container 元素的高度
 */
export const SET_TETRIS_CONTAINER_HEIGHT_KEY: InjectionKey<Function> = Symbol();
/**
 * 获取 running, 是否正在运行
 */
export const GET_RUNNING_KEY: InjectionKey<GetRunning> = Symbol();
/**
 * 获取 started, 是否已经开始过游戏
 */
export const GET_STARTED_KEY: InjectionKey<GetStarted> = Symbol();
/**
 * 获取 gameOver, 游戏是否结束
 */
export const GET_GAME_OVER_KEY: InjectionKey<Ref> = Symbol();


// ===========================  mitt Event Key  ===========================
/**
 * 增加 clearLines
 */
export const INCREASE_CLEAR_LINES_KEY: string = "increaseClearLines";
/**
 * 刷新网格图
 */
export const FLUSH_GRID_GRAPH_KEY: string = "flushGridGraph";
/**
 * 使方块下落
 */
export const DOWN_GRID_KEY: string = "downGrid";
/**
 * 重置 tetris 数据
 */
export const RESET_TETRIS_KEY: string = "resetTetris";
/**
 * 重置 tetris 控件数据
 */
export const RESET_TETRIS_CONTROL_INFO_KEY: string = "resetTetrisControlInfo";
/**
 * 渲染下一个要下落的方块到预览区
 */
export const RENDER_NEXT_DOWNING_GRID_KEY: string = "renderNextDowningGrid";
/**
 * 设置下落方块的每次下落的时间间隔
 */
export const SET_DOWN_INTERVAL_KEY: string = "updateDownInterval";
/**
 * 清除下落的定时器
 */
export const CLEAR_DOWN_TIMER_KEY: string = "clearDownTimer";



