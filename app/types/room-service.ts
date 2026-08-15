export interface OrderItem {
  name: string;
  note?: string;
  qty: number;
}

export interface Order {
  id: string;
  room: string;
  status: "pending" | "preparing" | "on-the-way";
  items: OrderItem[];
  timeAgo: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dotColor: string;
}
