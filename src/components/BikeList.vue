<template>
    <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-cyber-teal mb-3">Bikes</h2>
      <template v-if="store.dataLoaded.bikes">
        <ul v-if="store.bikes.length" class="space-y-2">
          <li v-for="bike in store.bikes" :key="bike.id" 
              class="p-2 bg-dark-void rounded-lg hover:bg-gray-700 transition-all">
            {{ bike.name }} <span class="text-cyber-teal">({{ bike.group }})</span>
          </li>
        </ul>
        <p v-else class="text-center text-gray-500 py-4">No bikes found</p>
      </template>
      <LoadingState v-else />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useApiStore } from '../stores/apiStore'
  import { onMounted } from 'vue'
  import LoadingState from './LoadingState.vue'
  
  const store = useApiStore()
  
  onMounted(() => {
    store.fetchBikes()
  })
  </script>