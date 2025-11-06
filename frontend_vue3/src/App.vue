<template>
  <div class="min-h-screen flex items-center justify-center">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App'
});
</script>

<style scoped>
/* 如果需要单文件组件样式 */
</style>
