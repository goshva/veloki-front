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
    } catch (error) {
      console.error(`Failed to load ${dataType}:`, error);
    } finally {
      loading.value = false;
    }
  };

  async function fetchBikes() {
    await withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/bikes`);
      bikes.value = response.data;
    }, "bikes");
  }

  async function fetchClients() {
    await withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/clients`);
      clients.value = response.data;
    }, "clients");
  }

  async function createClient(clientData: ClientData) {
    const response = await axios.post(`${apiBaseUrl}/clients`, clientData);
  
    // Log the response to verify its structure
    console.log('API Response:', response.data);
  
    // Ensure the response contains the expected client object
    if (response.data && response.data.id) {
      const newClient = {
        id: response.data.id,
        name: clientData.name,
        phone: clientData.phone,
      };
      clients.value.push(newClient);
      return newClient;
    } else {
      throw new Error('Failed to create client: Invalid response');
    }
  }

  async function fetchOrders() {
    await withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/orders`);
      orders.value = response.data;
    }, "orders");
  }

  async function fetchPrices() {
    await withLoading(async () => {
      const response = await axios.get(`${apiBaseUrl}/prices`);
      prices.value = response.data;
    }, "prices");
  }

  async function createOrder(orderData: OrderData) {
    await withLoading(async () => {
      const response = await axios.post(`${apiBaseUrl}/orders`, orderData);
      orders.value.push(response.data);
      return response.data;
    }, "orders");
  }

  async function updateOrder(orderId: number, orderData: Partial<OrderData>) {
    await withLoading(async () => {
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
    await withLoading(async () => {
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
