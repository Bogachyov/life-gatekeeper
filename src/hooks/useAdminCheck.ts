import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "anatolij.map@gmail.com";

export function useAdminCheck(userEmail: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin by email
    if (userEmail === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [userEmail]);

  return { isAdmin, loading };
}

export function isAdminEmail(email: string | undefined): boolean {
  return email === ADMIN_EMAIL;
}
