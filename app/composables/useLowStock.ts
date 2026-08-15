import type { InventoryItem } from "~/types";

/** Items at or below their reorder threshold — drives the low-stock banner and alerts. */
export const useLowStock = () => {
  const supabase = useSupabaseClient();
  const lowStockItems = useState<InventoryItem[]>("low-stock-items", () => []);

  const load = async () => {
    const { data } = await supabase.rpc("get_low_stock_items").select();
    if (data) {
      lowStockItems.value = data as InventoryItem[];
      return;
    }
    // Fallback if the RPC function isn't created yet: filter client-side.
    const { data: items } = await supabase.from("inventory_items").select("*");
    lowStockItems.value = (items ?? []).filter(
      (i: InventoryItem) => i.quantity_on_hand <= i.reorder_threshold,
    );
  };

  return { lowStockItems, load };
};
