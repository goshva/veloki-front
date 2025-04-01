<template>
  <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
    <h2 class="text-lg font-semibold text-cyber-teal mb-3">Orders</h2>
    <template v-if="store.dataLoaded.orders">
      <ul v-if="store.orders.length" class="space-y-3">
        <li v-for="order in store.orders" :key="order.id" 
            class="p-3 bg-dark-void rounded-lg hover:bg-gray-400 transition-all">
          <div class="flex justify-between items-center">
            <span>
              Order #{{ order.id }} 
              {{ getClientName(order.client_id) ? ` - ${getClientName(order.client_id)}` : '' }}
              - {{ order.status }}
            </span>
            <span class="text-cyber-teal">₽{{ order.total_cost }}</span>
          </div>
          <p class="text-sm">Duration: {{ order.duration_hours }}h</p>
          <ul class="ml-4 mt-1 space-y-1 text-sm">
            <li v-for="(cost, bikeId) in order.bike_costs" :key="bikeId">
              Bike {{ bikeId }}: ₽{{ cost }}
            </li>
          </ul>
          <div class="mt-2 flex gap-2">
            <button v-if="order.status === 'active'" 
                    @click="callClient(order.client_id)"
                    class="w-full py-1 bg-teal-200 text-dark-void rounded-lg hover:bg-teal-400 transition-all">
              ☎️ Call Client
            </button>
            <button v-if="order.status === 'active'" 
                    @click="openEndOrderModal(order)"
                    class="w-full py-1 bg-teal-200 text-dark-void rounded-lg hover:bg-teal-400 transition-all">
              End Order
            </button>
            <button v-if="order.status === 'completed'"
                    @click="deleteOrder(order.id)"
                    class="w-full py-1 bg-red-500 rounded-lg hover:bg-red-700 transition-all">
              Delete Order
            </button>
          </div>
        </li>
      </ul>
      <p v-else class="text-center text-gray-500 py-4">No orders found</p>
    </template>
    <LoadingState v-else />

    <!-- Order Modal -->
    <div v-if="showModal" class="bg-gray-300 bg-opacity-50 fixed inset-0 flex items-center justify-center">
      <div class="bg-gray-400 p-4 rounded-xl shadow-lg w-80">
        <h3 class="text-lg font-bold text-cyber-teal mb-3">
          Complete Order #{{ selectedOrder?.id || 'N/A' }}
        </h3>
        <p class="font-semibold">
          Total: ₽{{ selectedOrder?.total_cost || 0 }}
        </p>
        <label class="block mt-2 text-gray-300">Payment received by:</label>
        <select 
          v-model="selectedPaymentMethod"
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal"
        >
          <option value="">Select payment method</option>
          <option value="roma">Roma</option>
          <option value="misha">Misha</option>
          <option value="cash">Cash</option>
        </select>
        <div class="mt-4 flex gap-2">
          <button 
            @click="endOrder(selectedOrder?.id!)"
            class="w-full py-1 bg-teal-200 text-dark-void rounded-lg hover:bg-teal-400 transition-all"
            :disabled="!selectedOrder?.id || !selectedPaymentMethod"
          >
            End Order
          </button>
          <button 
            @click="closeModal"
            class="w-full py-1 bg-red-500 rounded-lg hover:bg-red-700 transition-all"
          >
            Cancel
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
import type { Order } from '../types/order'

const store = useApiStore()
const showModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const selectedPaymentMethod = ref('')

onMounted(() => {
  store.fetchOrders()
  store.fetchClients()
})

function getClientName(clientId: number): string | null {
  const client = store.clients.find(c => c.id === clientId)
  return client ? client.name : null
}

function callClient(clientId: number) {
  const client = store.clients.find(c => c.id === clientId)
  if (client && client.phone) {
    window.location.href = `tel:${client.phone}`
  } else {
    alert('Client phone number not found')
    console.error(`No client found with ID: ${clientId}`)
  }
}

function openEndOrderModal(order: Order) {
  if (!order || !order.id) {
    console.error('Invalid order provided to modal')
    return
  }
  selectedOrder.value = { ...order }
  selectedPaymentMethod.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
  selectedPaymentMethod.value = ''
}

async function endOrder(orderId: number) {
  if (!orderId) {
    alert('No order selected')
    return
  }
  if (!selectedPaymentMethod.value) {
    alert('Please select a payment method')
    return
  }

  const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  try {
    await store.updateOrder(orderId, {
      end_time: endTime,
      acceptor: selectedPaymentMethod.value,
      status: 'completed'
    })
    await store.fetchOrders()
    closeModal()
  } catch (error) {
    alert('Failed to end order')
    console.error('Error ending order:', error)
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
    console.error('Error deleting order:', error)
  }
}
</script>