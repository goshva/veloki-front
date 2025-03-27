<template>
    <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-cyber-teal mb-3">Create Order</h2>
      <form @submit.prevent="submitOrder" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300">Bike IDs (comma-separated)</label>
          <input v-model="bikeIds" type="text" placeholder="e.g., 1,2" 
                 class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal" 
                 required 
                 :disabled="store.loading" />
        </div>
        <div>
          <label class="block text-sm text-gray-300">Client ID</label>
          <input v-model="clientId" type="number" 
                 class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal" 
                 required 
                 :disabled="store.loading" />
        </div>
        <button type="submit" 
                class="w-full py-2 bg-cyber-teal text-dark-void rounded-lg hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="store.loading">
          {{ store.loading ? 'Creating...' : 'Create Order' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useApiStore } from '../stores/apiStore'
  
  const store = useApiStore()
  
  const bikeIds = ref('')
  const clientId = ref('')
  
  async function submitOrder() {
    if (store.loading) return
  
    const orderData = {
      bike_ids: bikeIds.value.split(',').map(id => parseInt(id.trim())),
      start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 'active',
      client_id: parseInt(clientId.value),
    }
  
    try {
      await store.createOrder(orderData)
      bikeIds.value = ''
      clientId.value = ''
      await store.fetchOrders() // Refresh the orders list
    } catch (error) {
      alert('Failed to create order')
      console.error('Error creating order:', error)
    }
  }
  </script>