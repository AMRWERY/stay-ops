export interface Order {
  id: number;
  room: string;
  time: string;
  items: string;
  assignee: string | null;
  avatar?: string;
  status: "pending" | "preparing" | "on-the-way" | "delivered";
  isUrgent?: boolean;
}
