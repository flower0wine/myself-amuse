<script setup lang="ts">
import {defineProps, toRefs} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: false
  }
});
const {title} = toRefs(props);
</script>

<template>
  <div class="info-box">
    <div class="info-title">{{title}}</div>
    <div class="info-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">

.info-title {
  color: #d39524;
  font-weight: 700;
  font-size: 14px;
  // text-indent 是为了抵消 letter-spacing 造成的文字整体左移
  text-indent: 5px;
  letter-spacing: 5px;
  margin-bottom: 5px;
}

.info-content {
  border-radius: 6px;
  min-width: 100px;
  font-weight: 700;
  color: #c5c10c;
  box-shadow: #18181857 1px 1px 1px 1px inset,
  #18181836 2px 2px 2px 2px inset,
  #cdcdcdb0 -1px -1px 1px 1px inset;
}
</style>