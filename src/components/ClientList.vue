<template>
    <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-cyber-teal mb-3">Clients</h2>
      <template v-if="store.dataLoaded.clients">
        <ul v-if="store.clients.length" class="space-y-2">
          <li v-for="client in store.clients" :key="client.id" 
              class="p-2 bg-dark-void rounded-lg hover:bg-gray-700 transition-all">
            {{ client.name }} - <span class="text-cyber-teal">{{ client.phone }}</span>
          </li>
        </ul>
        <p v-else class="text-center text-gray-500 py-4">No clients found</p>
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
    store.fetchClients()
  })
  </script>