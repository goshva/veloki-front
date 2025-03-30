<template>
  <div class="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <h3 class="text-lg font-medium text-gray-800 flex-shrink-0">
        Filter Bikes
      </h3>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow">
        <div class="flex-grow">
          <label for="bike-group-filter" class="sr-only">Filter by Group</label>
          <select
            id="bike-group-filter"
            v-model="selectedGroup"
            @change="applyFilter"
            class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Groups</option>
            <option value="mechanical">Mechanical</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <button
          type="button"
          @click="resetFilter"
          :disabled="selectedGroup === 'all'"
          class="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          Reset Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type BikeGroupFilter = "mechanical" | "electric" | "all";

const emit = defineEmits<{
  (e: "filter-applied", group: BikeGroupFilter): void;
}>();

const selectedGroup = ref<BikeGroupFilter>("all");

const applyFilter = () => {
  emit("filter-applied", selectedGroup.value);
};

const resetFilter = () => {
  if (selectedGroup.value !== "all") {
    selectedGroup.value = "all";
    applyFilter();
  }
};
</script>
