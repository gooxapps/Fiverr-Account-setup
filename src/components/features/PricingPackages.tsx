import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { PricingPackage } from "@/types";

interface PricingPackagesProps {
  pricing: PricingPackage[];
}

const packageColors = {
  Basic: {
    border: "border-blue-500/25",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    icon: "text-blue-400",
    accent: "bg-blue-400",
  },
  Standard: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/8",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    icon: "text-violet-400",
    accent: "bg-violet-400",
  },
  Premium: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    icon: "text-amber-400",
    accent: "bg-amber-400",
  },
};

export function PricingPackages({ pricing }: PricingPackagesProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  return (
    <SectionCard title="Pricing Packages" icon={icon}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pricing.map((pkg) => {
          const colors = packageColors[pkg.name];
          return (
            <div
              key={pkg.name}
              className={`relative rounded-xl border ${colors.border} ${colors.bg} p-4 flex flex-col`}
            >
              {pkg.name === "Standard" && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="px-2.5 py-0.5 bg-violet-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow">
                    Popular
                  </span>
                </div>
              )}
              <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg border text-xs font-semibold mb-3 ${colors.badge}`}>
                {pkg.name}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-2xl font-bold ${colors.icon}`}>{pkg.price}</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3 leading-snug">{pkg.description}</p>
              <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {pkg.deliveryDays}d delivery
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {pkg.revisions === 99 ? "Unlimited" : pkg.revisions} rev
                </span>
              </div>
              <ul className="space-y-1.5 flex-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${colors.accent} mt-1 flex-shrink-0`} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-white/6">
                <CopyButton
                  text={`${pkg.name} Package - ${pkg.price}\nDelivery: ${pkg.deliveryDays} days | Revisions: ${pkg.revisions}\n${pkg.features.join("\n")}`}
                  label="Copy"
                  className="w-full justify-center"
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
