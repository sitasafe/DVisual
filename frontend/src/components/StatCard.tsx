"use client";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sublabel?: string;
  color?: "blue" | "gold" | "purple";
}

export default function StatCard({ label, value, icon: Icon, sublabel, color = "blue" }: StatCardProps) {
  const colors = {
    blue: "text-neon-blue bg-neon-blue/10 border-neon-blue/20",
    gold: "text-neon-gold bg-neon-gold/10 border-neon-gold/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  return (
    <div className="glass-card p-6 flex items-center justify-between group overflow-hidden relative">
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold tracking-tight text-white group-hover:scale-105 transition-transform origin-left duration-300">
            {value}
          </h3>
          {sublabel && <span className="text-xs text-gray-500 font-medium">{sublabel}</span>}
        </div>
      </div>
      <div className={`p-4 rounded-2xl ${colors[color]} border transition-all duration-300 group-hover:rotate-12`}>
        <Icon className="w-8 h-8" />
      </div>
      
      {/* Background Glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-[60px] opacity-20 pointer-events-none rounded-full ${color === 'blue' ? 'bg-neon-blue' : 'bg-neon-gold'}`} />
    </div>
  );
}
