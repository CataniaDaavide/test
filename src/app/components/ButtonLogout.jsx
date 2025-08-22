"use client";

//hoocks - functions - lib
import { useRouter } from "next/navigation";
import { base_exceptionManager, fetchApi } from "../core/baseFunctions";

export function ButtonLogout() {
  const router = useRouter();
  const handleLogout = async (e) => {
    try {
      e.preventDefault();

      // chimata endpoint /api/auth/login
      await fetchApi("/api/auth/logout", "POST", {}, async (res) => {
        const data = await res.json();

        if (!res.ok && data.error != "") {
          return;
          //setError(data.error);
        }

        router.push("/login");
      });
    } catch (error) {
      base_exceptionManager(error);
    }
  };
  return (
    <button onClick={handleLogout} className="text-red-500 underline cursor-pointer">
      Logout
    </button>
  );
}
