<template>
    <div v-if="selectedBike" class="bg-neon-gray p-4 rounded-xl shadow-lg mt-4">
      <h3 class="text-lg font-semibold text-cyber-teal mb-3">Edit Bike</h3>
      <form @submit.prevent="saveBike">
        <div class="mb-3">
          <label class="block text-gray-700">Name</label>
          <input v-model="selectedBike.name" type="text" class="w-full p-2 border rounded">
        </div>
        <div class="mb-3">
          <label class="block text-gray-700">Group</label>
          <select v-model="selectedBike.group" class="w-full p-2 border rounded">
            <option value="mechanical">Mechanical</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <button type="submit" class="bg-cyber-teal text-white p-2 rounded">Save</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useApiStore } from '../stores/apiStore';
  
  const store = useApiStore();
  const selectedBike = ref<Bike | null>(null);
  
  const editBike = (bike: Bike) => {
    selectedBike.value = { ...bike };
  };
  
  const saveBike = () => {
    if (selectedBike.value) {
      // Assuming you have an API endpoint to update a bike
      axios.put(`${store.apiBaseUrl}/bikes/${selectedBike.value.id}`, selectedBike.value)
        .then(response => {
          const index = store.bikes.findIndex(b => b.id === selectedBike.value!.id);
          if (index !== -1) {
            store.bikes[index] = response.data;
          }
          selectedBike.value = null;
        });
    }
  };
  </script>
  