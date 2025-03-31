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
                    @click="OpenEndOrderModal(order)"
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

      <!-- модалка заказа -->
      <div v-if="showModal" class=" bg-gray-300 bg-opacity-50 fixed inset-0 flex items-center justify-center ">
        <div class="bg-gray-400 p-4 rounded-xl shadow-lg w-80">
          <h3 class="text-lg font-bold text-cyber-teal mb-3">Complete Order #{{ selectedOrder?.id }}</h3>
          <p class="text-ld font-semibold"> Total #{{ selectedOrder?.total_cost }}</p>
          <label class="block mt-2 text-gray-300">Payment received by:</label>
          <select v-model="selectedPaymentMethod"
                    class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyber-teal"> 
              <option value="roma">Roma</option>
              <option value="misha">Misha</option>
              <option value="cash">Cash</option>
          </select>
          <div class="mt-4 flex gap-2">
            <button @click="endOrder(selectedOrder?.id!)"
                    class="mt-2 w-full py-1 bg-teal-200 text-dark-void rounded-lg hover:bg-teal-400 transition-all">
              End Order
            </button>
            <button @click="closeModal"
                    class="mt-2 w-full py-1 bg-red-500 rounded-lg hover:bg-red-700 transition-all">
              Cancel
            </button>
                        <button @click="deleteOrder (selectedOrder?.id!)"
                    class="mt-2 w-full py-1 bg-red-500 rounded-lg hover:bg-red-700 transition-all">
              Delete Order
            </button>
          </div>
        </div>
      </div>

    </div>
  </template>
  
  <script setup lang="ts">
  import { useApiStore } from '../stores/apiStore'
  import { ref, onMounted } from 'vue'
  import LoadingState from './LoadingState.vue'
  import { Order } from '../types/order'
  
  const store = useApiStore()
  const showModal = ref(false)
  const selectedOrder = ref<Order | null>(null)
  const selectedPaymentMethod = ref('')
  
  onMounted(() => {
    store.fetchOrders()
  })

  function OpenEndOrderModal(order: Order) {
    showModal.value = true
    selectedOrder.value = order
    selectedPaymentMethod.value = 'Select payment'
  }

  function closeModal() {
    showModal.value = false
    selectedOrder.value = null
  }
  
  async function endOrder(orderId: number) {
    if (!orderId) return
    const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      await store.updateOrder(orderId, {
        end_time: endTime,
        payment_received_by: selectedPaymentMethod.value
      })
      await store.fetchOrders()
      closeModal()
    } catch (error) {
      alert('Failed to end order')
    }
  }

  async function deleteOrder(orderId: number) {
    try {
      await store.deleteOrder(orderId)
      await store.fetchOrders()
      if (showModal.value) {
        closeModal()
      }
    } catch (error) {
      alert('Failed to delete order')
    }
  }

  </script>