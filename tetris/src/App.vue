<script setup lang="ts">
import TetrisContainer from "@/components/TetrisContainer.vue";
</script>

<template>
  <div class="tetris-game">
    <tetris-container/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #000;
}

.tetris-game {
  display: flex;
  justify-content: center;
}
</style>
