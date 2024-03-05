<script setup lang="ts">
import {defineProps, toRefs} from "vue";

const props = defineProps({
  svg: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '1em'
  },
  height: {
    type: String,
    default: '1em'
  },
  fill: {
    type: String,
    default: 'currentColor'
  },
  verticalAlign: {
    type: String,
    default: '-2px'
  }
});
const {svg, width, height, fill, verticalAlign} = toRefs(props);
</script>

<template>
  <span class="svg-container" v-html="svg"></span>
</template>

<style lang="scss">
.svg-container {
  svg {
    width: v-bind(width);
    height: v-bind(height);
    fill: v-bind(fill);
    vertical-align: v-bind(verticalAlign);
  }
}
</style>

<style scoped lang="scss">

</style>