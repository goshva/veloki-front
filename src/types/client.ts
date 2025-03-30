export interface Client {
  id: number;
  name: string;
  phone: string;
}

export interface CreateClientDTO {
  name: string;
  phone: string;
}
