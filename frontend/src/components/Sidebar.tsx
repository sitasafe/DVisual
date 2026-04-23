"use client";
import { LayoutDashboard, FileUp, History, Accessibility, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileUp, label: "Cargar Documento", active: false },
  { icon: History, label: "Historial", active: false },
  { icon: Accessibility, label: "Accesibilidad", active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 h-screen glass border-r border-white/10 flex flex-col p-4 transition-all duration-300">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-neon-blue neon-glow-blue flex items-center justify-center">
          <span className="font-bold text-black text-xl">V</span>
        </div>
        <span className="font-bold text-xl hidden lg:block tracking-tight">VISION-AI</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5",
              item.active && "bg-white/10 text-neon-blue border border-white/10"
            )}
            title={item.label}
          >
            <item.icon className={cn("w-6 h-6", item.active && "text-neon-blue")} />
            <span className="font-medium hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Configuración</span>
        </button>
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all">
          <LogOut className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
