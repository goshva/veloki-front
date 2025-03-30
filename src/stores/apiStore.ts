import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { type Bike } from "@/types/bike";
import { type Client, type CreateClientDTO } from "@/types/client";
import {
  type Order,
  type CreateOrderDTO,
  type UpdateOrderDTO,
} from "@/types/order";
import { type Price } from "@/types/price";

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
      const response = await axios.get<Bike[]>(`${apiBaseUrl}/bikes`);
      bikes.value = response.data;
    }, "bikes");
  }

  async function fetchClients() {
    await withLoading(async () => {
      const response = await axios.get<Client[]>(`${apiBaseUrl}/clients`);
      clients.value = response.data;
    }, "clients");
  }

  async function createClient(CreateClientDTO: CreateClientDTO) {
    const response = await axios.post(`${apiBaseUrl}/clients`, CreateClientDTO);

    // Log the response to verify its structure
    console.log("API Response:", response.data);

    // Ensure the response contains the expected client object
    if (response.data && response.data.id) {
      const newClient = {
        id: response.data.id,
        name: CreateClientDTO.name,
        phone: CreateClientDTO.phone,
      };
      clients.value.push(newClient);
      return newClient;
    } else {
      throw new Error("Failed to create client: Invalid response");
    }
  }

  async function fetchOrders() {
    await withLoading(async () => {
      const response = await axios.get<Order[]>(`${apiBaseUrl}/orders`);
      orders.value = response.data;
    }, "orders");
  }

  async function fetchPrices() {
    await withLoading(async () => {
      const response = await axios.get<Price[]>(`${apiBaseUrl}/prices`);
      prices.value = response.data;
    }, "prices");
  }

  async function createOrder(CreateOrderDTO: CreateOrderDTO) {
    await withLoading(async () => {
      const response = await axios.post(`${apiBaseUrl}/orders`, CreateOrderDTO);
      orders.value.push(response.data);
      return response.data;
    }, "orders");
  }

  async function updateOrder(orderId: number, UpdateOrderDTO: UpdateOrderDTO) {
    await withLoading(async () => {
      const response = await axios.put(
        `${apiBaseUrl}/orders/${orderId}`,
        UpdateOrderDTO
      );
      const index = orders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data };
      }
      return response.data;
    }, "orders");
  }

  async function deleteOrder(orderId: number) {
    await withLoading(async () => {
      await axios.delete(`${apiBaseUrl}/orders/${orderId}`);
      orders.value = orders.value.filter((order) => order.id !== orderId);
    }, "orders");
  }

  async function updateBike(bikeId: number, bikeData: Partial<Bike>) {
    await withLoading(async () => {
      const response = await axios.put(
        `${apiBaseUrl}/bikes/${bikeId}`,
        bikeData
      );
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
    deleteOrder,
  };
});
