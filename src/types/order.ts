export interface Order {
  id: number;
  bike_ids: string;
  bike_groups: string;
  status: string;
  duration_hours: number;
  bike_costs: Record<string, string>;
  total_cost: string;
  end_time?: string;
  payment_receiver?: string;
  client_id: number;
}

export interface CreateOrderDTO {
  bike_ids: number[];
  start_time: string;
  status: string;
  client_id: number;
  end_time?: string;
}

export interface UpdateOrderDTO {
  bike_ids?: number[];
  start_time?: string;
  status?: string;
  client_id?: number;
  end_time?: string;
  acceptor: string;
}
