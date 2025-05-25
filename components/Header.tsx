import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      setUser(userData ? userData : "Гость");
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <header className="bg-white border-b border-[#B0CDE4] py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Логотип колледжа"
            width={40}
            height={40}
            className="rounded"
          />
        </Link>
      </div>
      <nav className="flex gap-3">
        <Link
          href="/students"
          className="px-4 py-2 rounded-lg font-semibold text-[#0060AC] hover:bg-[#0060AC]/10 transition-colors"
        >
          Студенты
        </Link>
        <Link
          href="/departments"
          className="px-4 py-2 rounded-lg font-semibold text-[#0060AC] hover:bg-[#0060AC]/10 transition-colors"
        >
          Отделения
        </Link>
        <Link
          href="/dormitory"
          className="px-4 py-2 rounded-lg font-semibold text-[#0060AC] hover:bg-[#0060AC]/10 transition-colors"
        >
          Общежитие
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <span className="text-[#737373] font-semibold text-base">{user}</span>
        <button
          onClick={handleLogout}
          className="bg-[#E41613] hover:bg-[#9C0D0B] text-white font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
