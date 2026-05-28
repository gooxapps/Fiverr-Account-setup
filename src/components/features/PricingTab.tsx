import { GigData } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";

interface PricingTabProps {
  gig: GigData;
}

const PACKAGE_STYLE = {
  Basic: {
    border: "border-blue-500/25",
    activeBg: "bg-blue-500/8",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    price: "text-blue-300",
    dot: "bg-blue-400",
    checkOn: "text-blue-400",
    headerBg: "from-blue-900/30 to-transparent",
  },
  Standard: {
    border: "border-violet-500/35",
    activeBg: "bg-violet-500/10",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    price: "text-violet-300",
    dot: "bg-violet-400",
    checkOn: "text-violet-400",
    headerBg: "from-violet-900/30 to-transparent",
  },
  Premium: {
    border: "border-amber-500/30",
    activeBg: "bg-amber-500/5",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    price: "text-amber-300",
    dot: "bg-amber-400",
    checkOn: "text-amber-400",
    headerBg: "from-amber-900/25 to-transparent",
  },
};

export function PricingTab({ gig }: PricingTabProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  // Collect all unique feature labels
  const allFeatures = Array.from(
    new Set(gig.pricing.flatMap((p) => p.features.map((f) => f.label)))
  );

  return (
    <div className="space-y-5">
      <SectionCard title="Scope & Pricing" icon={icon}>
        {/* Comparison table — matches Fiverr layout */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse min-w-[560px]">
            <thead>
              <tr>
                <th className="text-left pb-3 pr-4 w-44">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Features</span>
                </th>
                {gig.pricing.map((pkg) => {
                  const style = PACKAGE_STYLE[pkg.name];
                  return (
                    <th key={pkg.name} className="pb-3 px-2 text-center">
                      <div className={`rounded-xl border ${style.border} ${style.activeBg} px-3 py-3 relative`}>
                        {pkg.name === "Standard" && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                            <span className="px-2 py-0.5 bg-violet-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                              Popular
                            </span>
                          </div>
                        )}
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${style.badge.split(" ")[1]} mb-1`}>
                          {pkg.name}
                        </p>
                        <p className="text-white text-xs font-medium truncate">{pkg.packageTitle}</p>
                        <p className={`text-xl font-black mt-1 ${style.price}`}>{pkg.price}</p>
                        <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] text-gray-400">
                          <span>{pkg.deliveryDays}d delivery</span>
                          <span>·</span>
                          <span>{pkg.revisions} rev</span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Description row */}
              <tr className="border-t border-white/6">
                <td className="py-2.5 pr-4 text-xs text-gray-500">Description</td>
                {gig.pricing.map((pkg) => (
                  <td key={pkg.name} className="py-2.5 px-2 text-center">
                    <p className="text-[11px] text-gray-400 leading-snug">{pkg.description}</p>
                  </td>
                ))}
              </tr>
              {/* Feature rows */}
              {allFeatures.map((feature) => (
                <tr key={feature} className="border-t border-white/5">
                  <td className="py-2.5 pr-4 text-xs text-gray-400">{feature}</td>
                  {gig.pricing.map((pkg) => {
                    const f = pkg.features.find((x) => x.label === feature);
                    const included = f?.included ?? false;
                    const style = PACKAGE_STYLE[pkg.name];
                    return (
                      <td key={pkg.name} className="py-2.5 px-2 text-center">
                        {included ? (
                          <svg className={`w-4 h-4 mx-auto ${style.checkOn}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Copy buttons */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/6">
          {gig.pricing.map((pkg) => {
            const style = PACKAGE_STYLE[pkg.name];
            const text = `${pkg.name} — ${pkg.packageTitle} (${pkg.price})\nDelivery: ${pkg.deliveryDays} days | Revisions: ${pkg.revisions}\n${pkg.description}\n\nIncludes:\n${pkg.features.filter((f) => f.included).map((f) => "• " + f.label).join("\n")}`;
            return (
              <CopyButton
                key={pkg.name}
                text={text}
                label={`Copy ${pkg.name}`}
                className={`justify-center border ${style.border}`}
              />
            );
          })}
        </div>
      </SectionCard>

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
        <svg className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-violet-300 leading-relaxed">
          <span className="font-semibold">Fiverr tip:</span> Set your Basic package at a price accessible to new clients. Use "Add Gig Extra" in the Fiverr editor to offer add-ons like additional revisions, faster delivery, or extra features.
        </p>
      </div>
    </div>
  );
}
