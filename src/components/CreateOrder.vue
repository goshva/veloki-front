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
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-300">Select Bikes</label>
        <select 
          v-model="selectedBikeIds" 
          multiple
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyber-teal h-32"
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
      <div class="relative">
        <label class="block text-sm text-gray-300">Client Phone</label>
        <input 
          v-model="clientSearch" 
          type="tel" 
          placeholder="Enter phone or select client..."
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
          @input="debouncedSearch"
          @focus="showDropdown = true"
          @blur="handleBlur"
        />
        <div 
          v-if="showDropdown && filteredClients.length > 0" 
          class="absolute z-10 w-full mt-1 bg-dark-void border border-gray-600 rounded-lg max-h-48 overflow-y-auto"
        >
          <div 
            v-for="client in filteredClients" 
            :key="client.id" 
            class="p-2 hover:bg-gray-700 cursor-pointer "
            @mousedown="selectClient(client)"
          >
            {{ client.name }} ({{ client.phone }})
          </div>
        </div>
      </div>
      <div v-if="isNewClient">
        <label class="block text-sm text-gray-300">New Client Name</label>
        <input 
          v-model="newClientName" 
          type="text" 
          placeholder="Enter client name"
          class="mt-1 w-full p-2 bg-dark-void border border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-cyber-teal"
          :disabled="store.loading"
        />
      </div>
      <button 
        type="submit"
        class="w-full py-2 bg-cyber-teal text-dark-void rounded-lg hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.loading || (!clientSearch || (isNewClient && !newClientName))"
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
const clientSearch = ref('')
const newClientName = ref('')
const showDropdown = ref(false)
const selectedClient = ref<Client | null>(null)
const debounceTimeout = ref<NodeJS.Timeout | null>(null)

interface Client {
  id: number;
  name: string;
  phone: string;
}

onMounted(() => {
  store.fetchBikes()
  store.fetchClients()
})

const filteredBikes = computed(() => {
  if (!bikeSearch.value) return store.bikes
  return store.bikes.filter(bike => 
    bike.name.toLowerCase().includes(bikeSearch.value.toLowerCase())
  )
})

const filteredClients = computed(() => {
  if (!clientSearch.value || clientSearch.value.length < 3) return store.clients
  return store.clients.filter(client => 
    client.phone.includes(clientSearch.value) ||
    client.name.toLowerCase().includes(clientSearch.value.toLowerCase())
  )
})

const isNewClient = computed(() => {
  return clientSearch.value.length >= 3 && 
         !store.clients.some(client => client.phone === clientSearch.value)
})

const debouncedSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  
  debounceTimeout.value = setTimeout(() => {
    // Filtering happens in computed property
  }, 300)
}

const selectClient = (client: Client) => {
  selectedClient.value = client
  clientSearch.value = client.phone
  newClientName.value = ''
  showDropdown.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

async function submitOrder() {
  if (store.loading) return

  let clientIdToUse: number | undefined
  if (selectedClient.value) {
    clientIdToUse = selectedClient.value.id
  } else if (isNewClient.value && newClientName.value) {
    try {
      const newClient = await store.createClient({
        name: newClientName.value,
        phone: clientSearch.value
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
    clientSearch.value = ''
    newClientName.value = ''
    selectedClient.value = null
    bikeSearch.value = ''
    await store.fetchOrders()
    await store.fetchClients()
  } catch (error) {
    alert('Failed to create order')
    console.error('Error creating order:', error)
  }
}
</script>