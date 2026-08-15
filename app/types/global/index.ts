export type StaffRole =
  | "admin"
  | "warehouse_manager"
  | "room_service_staff"
  | "supervisor"
  | "housekeeping";
export type StaffStatus = "active" | "on_shift" | "off_shift" | "inactive";
export type RoomStatus =
  | "vacant_clean"
  | "vacant_dirty"
  | "occupied"
  | "out_of_service"
  | "maintenance";
export type StockMovementType =
  | "stock_in"
  | "stock_out"
  | "adjustment"
  | "waste"
  | "transfer";
export type PurchaseOrderStatus =
  | "draft"
  | "sent"
  | "partially_received"
  | "received"
  | "cancelled";
export type OrderStatus =
  | "pending"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";
export type OrderPriority = "normal" | "high" | "urgent";
export type NotificationType =
  | "low_stock"
  | "expiry"
  | "new_order"
  | "order_urgent"
  | "purchase_order"
  | "shift";

export interface Property {
  id: string;
  name: string;
  address?: string;
  timezone: string;
}

export interface Profile {
  id: string;
  property_id: string;
  full_name: string;
  role: StaffRole;
  status: StaffStatus;
  phone?: string;
  avatar_url?: string;
  hired_at?: string;
}

export interface Room {
  id: string;
  property_id: string;
  room_number: string;
  floor?: string;
  room_type?: string;
  status: RoomStatus;
  qr_token: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  parent_id?: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  category_id?: string;
  supplier_id?: string;
  sku?: string;
  name: string;
  unit: string;
  quantity_on_hand: number;
  reorder_threshold: number;
  unit_cost?: number;
  is_perishable: boolean;
  expiry_date?: string;
  location?: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  performed_by?: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  status: PurchaseOrderStatus;
  expected_date?: string;
  created_at: string;
  lines?: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  id: string;
  item_id: string;
  quantity: number;
  unit_cost?: number;
}

export interface RoomServiceOrder {
  id: string;
  room_id: string;
  status: OrderStatus;
  priority: OrderPriority;
  assigned_to?: string;
  notes?: string;
  guest_rating?: number;
  guest_feedback?: string;
  created_at: string;
  preparing_at?: string;
  on_the_way_at?: string;
  delivered_at?: string;
  items?: RoomServiceOrderItem[];
  room?: Room;
  assignee?: Profile;
}

export interface RoomServiceOrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  notes?: string;
  item?: InventoryItem;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
}

export interface Shift {
  id: string;
  profile_id: string;
  starts_at: string;
  ends_at: string;
  checked_in_at?: string;
  checked_out_at?: string;
}

export interface Database {
  public: {
    Tables: {
      properties: { Row: Property };
      profiles: { Row: Profile };
      rooms: { Row: Room };
      item_categories: { Row: ItemCategory };
      suppliers: { Row: Supplier };
      inventory_items: { Row: InventoryItem };
      stock_movements: { Row: StockMovement };
      purchase_orders: { Row: PurchaseOrder };
      purchase_order_lines: { Row: PurchaseOrderLine };
      room_service_orders: { Row: RoomServiceOrder };
      room_service_order_items: { Row: RoomServiceOrderItem };
      notifications: { Row: AppNotification };
      shifts: { Row: Shift };
    };
  };
}
