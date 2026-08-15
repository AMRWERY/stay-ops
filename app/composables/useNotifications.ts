import type { AppNotification } from "~/types";

/** Fetches notifications for the current profile and subscribes to new ones in realtime. */
export const useNotifications = () => {
  const supabase = useSupabaseClient();
  const { profile } = useCurrentProfile();
  const notifications = useState<AppNotification[]>("notifications", () => []);
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  );

  const load = async () => {
    if (!profile.value) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`profile_id.eq.${profile.value.id},role.eq.${profile.value.role}`)
      .order("created_at", { ascending: false })
      .limit(50);
    notifications.value = (data ?? []) as AppNotification[];
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    const n = notifications.value.find((n) => n.id === id);
    if (n) n.read = true;
  };

  const subscribe = () => {
    supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          notifications.value.unshift(payload.new as AppNotification);
        },
      )
      .subscribe();
  };

  return { notifications, unreadCount, load, markRead, subscribe };
};
