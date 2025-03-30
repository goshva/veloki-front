<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Bar -->
    <LoadingBar />

    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <!-- Sandwich Button (Hidden on Desktop) -->
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors mr-4 md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            <h1
              class="text-xl md:text-2xl font-semibold tracking-tight text-white"
            >
              Veloki Dashboard
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Container -->
    <div class="pt-16 flex min-h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 mt-16 bg-white border-r transform transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        aria-label="Sidebar"
      >
        <nav class="h-full overflow-y-auto">
          <ul class="p-4 space-y-1">
            <li v-for="route in routes" :key="route.path">
              <router-link
                :to="route.path"
                @click="closeSidebarOnMobile"
                :class="[
                  'w-full block px-4 py-3 rounded-lg text-left transition-colors duration-200',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                ]"
                active-class="bg-blue-50 text-blue-600 font-medium"
                inactive-class="text-gray-700"
              >
                {{ route.label }}
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
          'md:ml-64',
        ]"
      >
        <div
          v-show="isSidebarOpen"
          @click="toggleSidebar"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity md:hidden z-30"
          :class="
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          "
        />

        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import LoadingBar from "./components/LoadingBar.vue";

const router = useRouter();
const isSidebarOpen = ref(false);

const routes = [
  { path: "/orders", label: "Orders" },
  { path: "/bikes", label: "Bikes" },
  { path: "/clients", label: "Clients" },
  { path: "/tariffs", label: "Tariffs" },
  { path: "/create-order", label: "Create Order" },
];

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

header svg,
header h1 {
  color: white;
}
</style>
