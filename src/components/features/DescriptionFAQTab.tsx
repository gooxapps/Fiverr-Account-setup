import { useState } from "react";
import { GigData } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";

interface DescriptionFAQTabProps {
  gig: GigData;
}

export function DescriptionFAQTab({ gig }: DescriptionFAQTabProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const descLen = gig.description.length;
  const descColor =
    descLen < 800 ? "text-amber-400" : descLen <= 1150 ? "text-emerald-400" : "text-red-400";

  const descIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  const faqIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const allFAQText = gig.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return (
    <div className="space-y-5">
      {/* Description */}
      <SectionCard title="Description" icon={descIcon}>
        <div className="space-y-3">
          {/* Text display mimicking Fiverr's editor */}
          <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
            {/* Fake toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/6">
              {["B", "I", "U"].map((fmt) => (
                <button
                  key={fmt}
                  className="w-6 h-6 rounded text-xs font-bold text-gray-500 hover:bg-white/8 hover:text-white transition-colors"
                >
                  {fmt}
                </button>
              ))}
              <div className="w-px h-4 bg-white/8 mx-1" />
              {[
                <svg key="ul" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>,
                <svg key="ol" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
              ].map((icon, i) => (
                <button key={i} className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-white/8 hover:text-white transition-colors">
                  {icon}
                </button>
              ))}
            </div>
            <div className="p-4 max-h-72 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                {gig.description}
              </pre>
            </div>
          </div>

          {/* Char counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-48 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    descLen < 800 ? "bg-amber-500" : descLen <= 1150 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((descLen / 1200) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-semibold ${descColor}`}>
                {descLen} / 1200 chars
              </span>
            </div>
            <CopyButton text={gig.description} label="Copy Description" />
          </div>
          <p className="text-xs text-gray-500">
            Aim for 800–1200 characters. Use emojis and bullet points to improve readability and buyer engagement.
          </p>
        </div>
      </SectionCard>

      {/* FAQ */}
      <SectionCard title="Frequently Asked Questions" icon={faqIcon} badge={`${gig.faqs.length} Q&As`}>
        <div className="space-y-2">
          {gig.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[9px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-white leading-snug">{faq.question}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFAQ === i && (
                <div className="px-4 pb-4 border-t border-white/6">
                  <p className="text-sm text-gray-400 leading-relaxed mt-3">{faq.answer}</p>
                  <div className="mt-3">
                    <CopyButton
                      text={`Q: ${faq.question}\nA: ${faq.answer}`}
                      label="Copy Q&A"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="pt-2">
            <CopyButton
              text={allFAQText}
              label="Copy All FAQs"
              className="w-full justify-center py-2"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Fiverr shows up to 10 FAQs. Paste each Q&A pair into the "+ Add FAQ" button in the Description & FAQ tab.
        </p>
      </SectionCard>
    </div>
  );
}
