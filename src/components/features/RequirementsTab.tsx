import { GigData, RequirementQuestion } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";

interface RequirementsTabProps {
  gig: GigData;
}

export function RequirementsTab({ gig }: RequirementsTabProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );

  const freeTextQs = gig.buyerRequirements.filter((q) => q.type === "FREE_TEXT");
  const mcQs = gig.buyerRequirements.filter((q) => q.type === "MULTIPLE_CHOICE");

  const allText = gig.buyerRequirements
    .map((q, i) => `${i + 1}. [${q.type === "FREE_TEXT" ? "Free Text" : "Multiple Choice"}] ${q.question}${q.options ? "\n   Options: " + q.options.join(" | ") : ""}`)
    .join("\n\n");

  return (
    <div className="space-y-5">
      {/* Fiverr default questions banner */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="px-4 py-3 bg-white/3 border-b border-white/6 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fiverr Default Questions</span>
          <span className="text-[10px] text-gray-500">(automatically added to all gigs)</span>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { label: "MULTIPLE CHOICE", q: "If you're ordering for a business, what's your industry?", hint: "3D design, e-commerce, accounting, marketing, etc." },
            { label: "MULTIPLE CHOICE", q: "Is this order part of a bigger project you're working on?", hint: "Building a mobile app, creating an animation, developing a game, etc." },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
              <p className="text-sm text-gray-300 mt-0.5">{item.q}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionCard title="Your Questions" icon={icon} badge={`${gig.buyerRequirements.length} questions`}>
        <div className="space-y-3">
          {/* Free text questions */}
          {freeTextQs.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Free Text Questions
              </p>
              {freeTextQs.map((q, i) => (
                <RequirementCard key={i} question={q} index={i} />
              ))}
            </div>
          )}

          {/* Multiple choice questions */}
          {mcQs.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Multiple Choice Questions
              </p>
              {mcQs.map((q, i) => (
                <RequirementCard key={i} question={q} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/6 mt-4">
          <CopyButton
            text={allText}
            label="Copy All Requirements"
            className="w-full justify-center py-2"
          />
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Add these in the Fiverr "Requirements" tab using "+ Add New Question". Choose Free Text for open-ended or Multiple Choice for structured responses.
        </p>
      </SectionCard>
    </div>
  );
}

function RequirementCard({ question, index }: { question: RequirementQuestion; index: number }) {
  const isMultiChoice = question.type === "MULTIPLE_CHOICE";
  return (
    <div className="group rounded-xl border border-white/8 hover:border-white/14 transition-all overflow-hidden">
      <div className="flex items-start gap-3 p-3.5">
        <span className={`flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
          isMultiChoice
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        }`}>
          {isMultiChoice ? "MC" : "FT"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 leading-snug">{question.question}</p>
          {question.options && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.options.map((opt, oi) => (
                <span
                  key={oi}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-[11px] text-gray-400"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <CopyButton
            text={question.question + (question.options ? "\nOptions: " + question.options.join(" | ") : "")}
          />
        </div>
      </div>
    </div>
  );
}
