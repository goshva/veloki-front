<template>
    <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-cyber-teal mb-3">Orders</h2>
      <template v-if="store.dataLoaded.orders">
        <ul v-if="store.orders.length" class="space-y-3">
          <li v-for="order in store.orders" :key="order.id" 
              class="p-3 bg-dark-void rounded-lg hover:bg-gray-400 transition-all">
            <div class="flex justify-between items-center">
              <span>Order #{{ order.id }} - {{ order.status }}</span>
              <span class="text-cyber-teal">₽{{ order.total_cost }}</span>
            </div>
            <p class="text-sm">Duration: {{ order.duration_hours }}h</p>
            <ul class="ml-4 mt-1 space-y-1 text-sm text-gray-400">
              <li v-for="(cost, bikeId) in order.bike_costs" :key="bikeId">
                Bike {{ bikeId }}: ₽{{ cost }}
              </li>
            </ul>
            <button v-if="order.status === 'active'" 
                    @click="endOrder(order.id)"
                    class="mt-2 w-full py-1 bg-teal-200 text-dark-void rounded-lg hover:bg-teal-400 transition-all">
              End Order
            </button>

            <button v-if="order.status === 'completed'"
                    @click="deleteOrder(order.id)"
                    class="mt-2 w-full py-1 bg-red-500 rounded-lg hover:bg-red-700 transition-all">
              Delete Order
            </button>
          </li>
        </ul>
        <p v-else class="text-center text-gray-500 py-4">No orders found</p>
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
    store.fetchOrders()
  })
  
  async function endOrder(orderId: number) {
    const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    try {
      await store.updateOrder(orderId, {
        end_time: endTime,
        status: 'completed',
      })
      store.fetchOrders()
    } catch (error) {
      alert('Failed to end order')
    }
  }

  async function deleteOrder(orderId: number) {
    try {
      await store.deleteOrder(orderId)
      await store.fetchOrders()
    } catch (error) {
      alert('Failed to delete order')
    }
  }

  </script>