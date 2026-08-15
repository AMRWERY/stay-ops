export interface OrderItem {
  name: string;
  note?: string;
  qty: number;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "on-the-way"
  | "delivered";

export interface OrderAssignee {
  name: string;
  avatar?: string;
  /** Shown when there's no avatar. Derived from the name when omitted. */
  initials?: string;
}

export interface Order {
  id: string;
  room: string;
  status: OrderStatus;
  items: OrderItem[];
  timeAgo: string;
  assignee?: OrderAssignee;
  isUrgent?: boolean;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  initials?: string;
}
