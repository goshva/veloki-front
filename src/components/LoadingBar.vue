<template>
  <div class="fixed top-0 left-0 right-0 z-[60]">
    <div 
      v-show="isLoading"
      class="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"
      :style="{ width: `${loadingProgress}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useApiStore } from '../stores/apiStore'

const isLoading = ref(false)
const loadingProgress = ref(0)
const store = useApiStore()

// Watch for loading state changes
watch(() => store.loading, (newValue) => {
  if (newValue) {
    isLoading.value = true
    loadingProgress.value = 20
    setTimeout(() => loadingProgress.value = 70, 200)
  } else {
    loadingProgress.value = 100
    setTimeout(() => {
      isLoading.value = false
      loadingProgress.value = 0
    }, 300)
  }
})
</script>

<style scoped>
.h-1 {
  transition: width 0.3s ease-in-out;
}
</style>