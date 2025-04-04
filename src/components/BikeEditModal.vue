<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div class="bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Edit Bike</h3>
        <form @submit.prevent="save" v-if="localBike">
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
          <div class="flex justify-end">
            <button type="button" @click="close" class="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { Bike } from '@/types/bike';
  
  const props = defineProps<{ selectedBike: Bike | null, isOpen: boolean }>();
  const emit = defineEmits<{ (e: 'save', bike: Bike): void, (e: 'close'): void }>();
  
  const localBike = ref<Bike | null>(props.selectedBike ? { ...props.selectedBike } : null);
  
  watch(() => props.selectedBike, (newBike) => {
    localBike.value = newBike ? { ...newBike } : null;
  });
  
  const save = () => {
    if (localBike.value) {
      emit('save', localBike.value);
    }
  };
  
  const close = () => {
    emit('close');
  };
  </script>
  