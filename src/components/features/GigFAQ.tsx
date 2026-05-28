import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { FAQItem } from "@/types";
import { useState } from "react";

interface GigFAQProps {
  faqs: FAQItem[];
}

export function GigFAQ({ faqs }: GigFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const allText = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return (
    <SectionCard title="FAQ Section" icon={icon} badge={`${faqs.length} questions`}>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/8 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/3 transition-colors"
            >
              <span className="text-sm font-medium text-white leading-snug">{faq.question}</span>
              <svg
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 border-t border-white/6">
                <p className="text-sm text-gray-400 leading-relaxed mt-3">{faq.answer}</p>
                <div className="mt-3">
                  <CopyButton text={`Q: ${faq.question}\nA: ${faq.answer}`} label="Copy Q&A" />
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="pt-1">
          <CopyButton text={allText} label="Copy All FAQs" className="w-full justify-center py-2" />
        </div>
      </div>
    </SectionCard>
  );
}
