<template>
  <div class="bg-neon-gray p-4 rounded-xl shadow-lg">
    <BikeEdit
      v-if="selectedBike"
      :selectedBike="selectedBike"
      @save="saveBike"
    />
    <h2 class="text-lg font-semibold text-cyber-teal mb-3">Bikes</h2>
    <template v-if="store.dataLoaded.bikes">
      <ul v-if="store.bikes.length" class="space-y-2">
        <li
          v-for="bike in store.bikes"
          :key="bike.id"
          @click="editBike(bike)"
          class="p-2 bg-dark-void rounded-lg hover:bg-stone-200 transition-all cursor-pointer"
        >
          {{ bike.name }}
          <span class="text-cyber-teal">({{ bike.group }})</span>
        </li>
      </ul>
      <p v-else class="text-center text-gray-500 py-4">No bikes found</p>
    </template>
    <LoadingState v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApiStore } from "../stores/apiStore";
import { onMounted } from "vue";
import LoadingState from "./LoadingState.vue";
import type { Bike } from "@/types/bike";
import BikeEdit from "./BikeEdit.vue";

const store = useApiStore();
const selectedBike = ref<Bike | null>(null);

onMounted(() => {
  store.fetchBikes();
});

const editBike = (bike: Bike) => {
  selectedBike.value = { ...bike };
};

const saveBike = (updatedBike: Bike) => {
  store.updateBike(updatedBike.id, updatedBike).then(() => {
    selectedBike.value = null;
  });
};
</script>
