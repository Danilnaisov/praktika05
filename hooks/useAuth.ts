import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const authUser = await getAuthUser();
      if (!authUser) {
        router.push("/login");
      } else {
        setUser(authUser);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  return { user, loading };
}
