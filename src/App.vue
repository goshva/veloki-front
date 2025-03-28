<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Bar -->
    <LoadingBar />

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <!-- Sandwich Button -->
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors mr-4"
              aria-label="Toggle menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <h1 class="text-xl md:text-2xl font-semibold tracking-tight">
              Veloki Dashboard
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Container -->
    <div class="pt-16 flex min-h-screen">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 mt-16 bg-white border-r transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ]"
      >
        <nav class="h-full overflow-y-auto">
          <ul class="p-4 space-y-1">
            <li v-for="route in routes" :key="route.path">
              <router-link
                :to="route.path"
                v-slot="{ isActive }"
                custom
              >
                <button
                  @click="navigateTo(route.path)"
                  :class="[
                    'w-full px-4 py-3 rounded-lg text-left transition-colors duration-200',
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700',
                  ]"
                >
                  {{ route.label }}
                </button>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main
        :class="[
          'flex-1 transition-all duration-300 ease-in-out',
          'px-4 py-6 md:px-6 md:py-8',
          isSidebarOpen ? 'md:ml-64' : '',
        ]"
      >
        <!-- Backdrop overlay for mobile -->
        <div
          v-if="isSidebarOpen"
          @click="toggleSidebar"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity md:hidden z-30"
        />

        <!-- Content -->
        <div class="max-w-7xl mx-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useApiStore } from "./stores/apiStore";
import LoadingBar from "./components/LoadingBar.vue";

const apiStore = useApiStore();
const router = useRouter();
const isSidebarOpen = ref(false);

const routes = [
  { path: '/orders', label: 'Orders' },
  { path: '/bikes', label: 'Bikes' },
  { path: '/clients', label: 'Clients' },
  { path: '/tariffs', label: 'Tariffs' },
  { path: '/create-order', label: 'Create Order' },
];

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function navigateTo(path) {
  router.push(path);
  // Only close sidebar on mobile
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
}
</script>