<template>
    <div class="bg-neon-gray p-4 rounded-xl shadow-lg mt-4">
      <h3 class="text-lg font-semibold text-cyber-teal mb-3">Edit Bike</h3>
      <form @submit.prevent="save">
        <div class="mb-3">
          <label class="block text-gray-700">Name</label>
          <input v-model="localBike.name" type="text" class="w-full p-2 border rounded">
        </div>
        <div class="mb-3">
          <label class="block text-gray-700">Group</label>
          <select v-model="localBike.group" class="w-full p-2 border rounded">
            <option value="mechanical">Mechanical</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <button type="submit" class="bg-cyber-teal p-2 rounded">Save</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{ selectedBike: Bike }>();
  const emit = defineEmits<{ (e: 'save', bike: Bike): void }>();
  
  const localBike = ref<Bike>({ ...props.selectedBike });
  
  watch(() => props.selectedBike, (newBike) => {
    localBike.value = { ...newBike };
  });
  
  const save = () => {
    emit('save', localBike.value);
  };
  </script>
  