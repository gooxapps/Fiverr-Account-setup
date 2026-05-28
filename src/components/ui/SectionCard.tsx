interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon, badge, children, className = "" }: SectionCardProps) {
  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        {badge && (
          <span className="px-2.5 py-1 bg-violet-500/15 border border-violet-500/25 text-violet-400 text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
