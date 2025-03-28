import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

interface Bike {
  id: number;
  name: string;
  group: "mechanical" | "electric";
}

interface Client {
  id: number;
  name: string;
  phone: string;
}
interface ClientData {
  name: string;
  phone: string;
}
interface Order {
  id: number;
  bike_ids: string;
  bike_groups: string;
  status: string;
  duration_hours: number;
  bike_costs: Record<string, string>;
  total_cost: string;
  end_time?: string;
}

interface Price {
  id: number;
  bike_group: string;
  duration: string;
  price: string;
}

interface OrderData {
  bike_ids: number[];
  start_time: string;
  status: string;
  client_id: number;
  end_time?: string;
}

export const useApiStore = defineStore("api", () => {
  const bikes = ref<Bike[]>([]);
  const clients = ref<Client[]>([]);
  const orders = ref<Order[]>([]);
  const prices = ref<Price[]>([]);
  const loading = ref(false);
  const dataLoaded = ref({
    bikes: false,
    clients: false,
    orders: false,
    prices: false,
  });

  const apiBaseUrl = "https://veloki.ru/v/api";

  const withLoading = async (
    operation: () => Promise<any>,
    dataType: keyof typeof dataLoaded.value
  ) => {
    loading.value = true;
    dataLoaded.value[dataType] = false;
    try {
      await operation();
      dataLoaded.value[dataType] = true;
    } finally {
      loading.value = false;
    }
  };

  async function fetchBikes() {
    return withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/bikes`);
      bikes.value = response.data;
    }, "bikes");
  }

  async function fetchClients() {
    return withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/clients`);
      clients.value = response.data;
    }, "clients");
  }
  async function createClient(clientData: ClientData) {
    return withLoading(async () => {
      const response = await axios.post(`${apiBaseUrl}/clients`, clientData);
      clients.value.push(response.data);
      return response.data;
    }, "clients");
  }
  async function fetchOrders() {
    return withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/orders`);
      orders.value = response.data;
    }, "orders");
  }

  async function fetchPrices() {
    return withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/prices`);
      prices.value = response.data;
    }, "prices");
  }

  async function createOrder(orderData: OrderData) {
    return withLoading(async () => {
      const response = await axios.post(`${apiBaseUrl}/orders`, orderData);
      orders.value.push(response.data);
      return response.data;
    }, "orders");
  }

  async function updateOrder(orderId: number, orderData: Partial<OrderData>) {
    return withLoading(async () => {
      const response = await axios.put(
        `${apiBaseUrl}/orders/${orderId}`,
        orderData
      );
      const index = orders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data };
      }
      return response.data;
    }, "orders");
  }

  async function updateBike(bikeId: number, bikeData: Partial<Bike>) {
    return withLoading(async () => {
      const response = await axios.put(`${apiBaseUrl}/bikes/${bikeId}`, bikeData);
      const index = bikes.value.findIndex((bike) => bike.id === bikeId);
      if (index !== -1) {
        bikes.value[index] = { ...bikes.value[index], ...response.data };
      }
      return response.data;
    }, "bikes");
  }

  return {
    bikes,
    clients,
    orders,
    prices,
    loading,
    dataLoaded,
    // Actions
    createClient,
    fetchBikes,
    fetchClients,
    fetchOrders,
    fetchPrices,
    createOrder,
    updateOrder,
    updateBike,
  };
});
