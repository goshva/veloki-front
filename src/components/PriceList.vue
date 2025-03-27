<template>
  <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
    <h2 class="text-lg font-semibold text-cyber-teal mb-3">Prices</h2>
    <template v-if="store.dataLoaded.prices">
      <ul v-if="store.prices.length" class="space-y-2">
        <li v-for="price in store.prices" :key="price.id" 
            class="p-2 bg-dark-void rounded-lg hover:bg-gray-700 transition-all">
          {{ price.bike_group }} - {{ price.duration }}: 
          <span class="text-cyber-teal">₽{{ price.price }}</span>
        </li>
      </ul>
      <p v-else class="text-center text-gray-500 py-4">No prices found</p>
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
  store.fetchPrices()
})
</script>