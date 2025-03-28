<template>
  <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
    <h2 class="text-lg font-semibold text-cyber-teal mb-3">Create Order</h2>
    <form @submit.prevent="submitOrder" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-300">Search Bikes</label>
        <input 
          v-model="bikeSearch" 
          type="text" 
          placeholder="Search bikes by name..."
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-300">Select Bikes</label>
        <select 
          v-model="selectedBikeIds" 
          multiple
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal h-32"
          :disabled="store.loading"
          required
        >
          <option 
            v-for="bike in filteredBikes" 
            :key="bike.id" 
            :value="bike.id"
          >
            {{ bike.name }} ({{ bike.group }})
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-300">Search Clients</label>
        <input 
          v-model="clientSearch" 
          type="text" 
          placeholder="Search clients by name or phone..."
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-300">Select Client</label>
        <select 
          v-model="selectedClientId" 
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
          required
        >
          <option value="" disabled>Select a client</option>
          <option 
            v-for="client in filteredClients" 
            :key="client.id" 
            :value="client.id"
          >
            {{ client.name }} ({{ client.phone }})
          </option>
        </select>
      </div>
      <div v-if="!selectedClientId || !store.clients.some(c => c.id === selectedClientId)">
        <label class="block text-sm text-gray-300">New Client Phone</label>
        <input 
          v-model="newClientPhone" 
          type="tel" 
          placeholder="Enter phone number for new client"
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
        />
      </div>
      <button 
        type="submit"
        class="w-full py-2 bg-cyber-teal text-dark-void rounded-lg hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.loading || (!selectedClientId && !newClientPhone)"
      >
        {{ store.loading ? 'Creating...' : 'Create Order' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApiStore } from '../stores/apiStore'

const store = useApiStore()

const selectedBikeIds = ref<number[]>([])
const bikeSearch = ref('')
const selectedClientId = ref<number | ''>('')
const clientSearch = ref('')
const newClientPhone = ref('')

// Fetch data when component mounts
onMounted(() => {
  store.fetchBikes()
  store.fetchClients()
})

// Filter bikes based on search input
const filteredBikes = computed(() => {
  if (!bikeSearch.value) return store.bikes
  return store.bikes.filter(bike => 
    bike.name.toLowerCase().includes(bikeSearch.value.toLowerCase())
  )
})

// Filter clients based on search input
const filteredClients = computed(() => {
  if (!clientSearch.value) return store.clients
  return store.clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.value.toLowerCase()) ||
    client.phone.includes(clientSearch.value)
  )
})

async function submitOrder() {
  if (store.loading) return

  let clientIdToUse = selectedClientId.value
  if (!clientIdToUse && newClientPhone.value) {
    try {
      // Create new client
      const newClient = await store.createClient({
        name: `Client_${newClientPhone.value}`,
        phone: newClientPhone.value
      })
      clientIdToUse = newClient.id
    } catch (error) {
      alert('Failed to create new client')
      console.error('Error creating client:', error)
      return
    }
  }

  if (!clientIdToUse) return

  const orderData = {
    bike_ids: selectedBikeIds.value,
    start_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: 'active',
    client_id: clientIdToUse,
  }

  try {
    await store.createOrder(orderData)
    selectedBikeIds.value = []
    selectedClientId.value = ''
    bikeSearch.value = ''
    clientSearch.value = ''
    newClientPhone.value = ''
    await store.fetchOrders() // Refresh the orders list
    await store.fetchClients() // Refresh the clients list
  } catch (error) {
    alert('Failed to create order')
    console.error('Error creating order:', error)
  }
}
</script>