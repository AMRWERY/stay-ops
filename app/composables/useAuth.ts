import type { Profile } from "~/types/global";

/**
 * Wraps @nuxtjs/supabase's user/session with the app's `profiles` row,
 * which carries role + property_id used for permissions and scoping queries.
 */
export const useCurrentProfile = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const profile = useState<Profile | null>("current-profile", () => null);

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null;
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();
    profile.value = data as Profile | null;
  };

  watch(user, fetchProfile, { immediate: true });

  const can = (roles: Profile["role"][]) => {
    if (!profile.value) return false;
    return roles.includes(profile.value.role);
  };

  return { profile, fetchProfile, can };
};
