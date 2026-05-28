import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface GigDescriptionProps {
  description: string;
}

export function GigDescription({ description }: GigDescriptionProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const renderDescription = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-semibold text-white mt-3 first:mt-0">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-gray-300 leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="text-white font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      if (line.startsWith("✅") || line.startsWith("🚀") || line.startsWith("💼") || line.startsWith("📌")) {
        return (
          <p key={i} className="text-gray-300 leading-relaxed text-sm">
            {line}
          </p>
        );
      }
      if (line.startsWith("•")) {
        return (
          <p key={i} className="text-gray-400 text-sm ml-2 leading-relaxed">
            {line}
          </p>
        );
      }
      if (line.trim() === "") return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-gray-300 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <SectionCard title="SEO Description" icon={icon}>
      <div className="space-y-1.5 mb-4">{renderDescription(description)}</div>
      <CopyButton text={description} label="Copy Full Description" className="w-full justify-center py-2" />
    </SectionCard>
  );
}
