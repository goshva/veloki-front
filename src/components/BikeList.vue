<template>
  <div> <!-- Ensure the root element is a single DOM element -->
    <FilterForBikeList @filter-applied="handleFilterChange" />

    <div class="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 mt-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-0">
        Bikes
        <span v-if="currentFilter !== 'all'" class="text-base font-normal text-gray-500 ml-2">
          (Filtered by: {{ currentFilter }})
        </span>
      </h2>

      <template v-if="store.loading">
        <LoadingState />
      </template>
      <template v-else-if="store.dataLoaded.bikes">
        <ul v-if="filteredBikes.length" class="space-y-3">
          <li
            v-for="bike in filteredBikes"
            :key="bike.id"
            @click="editBike(bike)"
            tabindex="0"
            class="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-400 transition-all duration-150 ease-in-out cursor-pointer"
          >
            <span class="font-medium text-gray-800">{{ bike.name }}</span>
            <span class="text-sm text-blue-600 ml-2">({{ bike.group }})</span>
          </li>
        </ul>
        <p v-else class="text-center text-gray-500 py-8">
          {{ currentFilter === "all" ? "No bikes found." : "No bikes match the current filter." }}
        </p>
      </template>
    </div>

    <BikeEditModal
      :selectedBike="selectedBike"
      :isOpen="isModalOpen"
      @save="saveBike"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApiStore } from "../stores/apiStore";
import LoadingState from "./LoadingState.vue";
import type { Bike } from "@/types/bike";
import BikeEditModal from "./BikeEditModal.vue";
import FilterForBikeList from "./filters/FilterForBikeList.vue";

type BikeGroupFilter = "mechanical" | "electric" | "all";

const store = useApiStore();
const selectedBike = ref<Bike | null>(null);
const currentFilter = ref<BikeGroupFilter>("all");
const isModalOpen = ref(false);

onMounted(() => {
  if (!store.dataLoaded.bikes && !store.loading) {
    store.fetchBikes();
  }
});

const filteredBikes = computed(() => {
  if (!store.dataLoaded.bikes) {
    return [];
  }
  if (currentFilter.value === "all") {
    return store.bikes;
  }
  return store.bikes.filter((bike) => bike.group === currentFilter.value);
});

const handleFilterChange = (selectedGroup: BikeGroupFilter) => {
  currentFilter.value = selectedGroup;
  if (selectedBike.value && selectedGroup !== "all" && selectedBike.value.group !== selectedGroup) {
    selectedBike.value = null;
  }
};

const editBike = (bike: Bike) => {
  selectedBike.value = JSON.parse(JSON.stringify(bike));
  isModalOpen.value = true;
};

const saveBike = async (updatedBikeData: Partial<Bike>) => {
  if (!selectedBike.value) return;
  try {
    await store.updateBike(selectedBike.value.id, updatedBikeData);
    selectedBike.value = null;
    store.fetchBikes();
    isModalOpen.value = false;
  } catch (error) {
    console.error("Failed to save bike:", error);
  }
};

const closeModal = () => {
  selectedBike.value = null;
  isModalOpen.value = false;
};
</script>
