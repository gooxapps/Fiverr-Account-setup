import { GigData } from "@/types";

export function exportGigToMarkdown(gig: GigData): string {
  let md = `# Fiverr Gig: ${gig.title}\n\n`;
  
  md += `**Category:** ${gig.category} > ${gig.subCategory}\n\n`;
  md += `**Search Tags:** ${gig.tags.join(", ")}\n\n`;
  
  md += `---\n\n## Pricing Packages\n\n`;
  md += `| Feature | Basic | Standard | Premium |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **Name** | ${gig.pricing[0].packageTitle} | ${gig.pricing[1].packageTitle} | ${gig.pricing[2].packageTitle} |\n`;
  md += `| **Price** | ${gig.pricing[0].price} | ${gig.pricing[1].price} | ${gig.pricing[2].price} |\n`;
  md += `| **Delivery** | ${gig.pricing[0].deliveryDays} Days | ${gig.pricing[1].deliveryDays} Days | ${gig.pricing[2].deliveryDays} Days |\n`;
  md += `| **Revisions** | ${gig.pricing[0].revisions} | ${gig.pricing[1].revisions} | ${gig.pricing[2].revisions} |\n`;
  md += `| **Description** | ${gig.pricing[0].description} | ${gig.pricing[1].description} | ${gig.pricing[2].description} |\n`;

  // Aggregate all unique features from all packages
  const allFeatureLabels = new Set<string>();
  gig.pricing.forEach(pkg => pkg.features.forEach(f => allFeatureLabels.add(f.label)));
  
  Array.from(allFeatureLabels).forEach(featureLabel => {
    const b = gig.pricing[0].features.find(f => f.label === featureLabel)?.included ? "✅" : "❌";
    const s = gig.pricing[1].features.find(f => f.label === featureLabel)?.included ? "✅" : "❌";
    const p = gig.pricing[2].features.find(f => f.label === featureLabel)?.included ? "✅" : "❌";
    md += `| **${featureLabel}** | ${b} | ${s} | ${p} |\n`;
  });

  md += `\n---\n\n## Description\n\n${gig.description}\n\n`;
  
  md += `---\n\n## Frequently Asked Questions\n\n`;
  gig.faqs.forEach((faq, i) => {
    md += `**Q${i+1}: ${faq.question}**\n${faq.answer}\n\n`;
  });

  md += `---\n\n## Buyer Requirements\n\n`;
  gig.buyerRequirements.forEach((req, i) => {
    md += `${i+1}. ${req.question} (${req.type})\n`;
    if (req.options && req.options.length > 0) {
      req.options.forEach(opt => md += `   - [ ] ${opt}\n`);
    }
  });

  return md;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function calculateSeoScore(gig: GigData): number {
  let score = 50; // Base score
  const titleLower = gig.title.toLowerCase();
  const descLower = gig.description.toLowerCase();
  
  // Check if main keywords are in title
  gig.positiveKeywords.forEach(kw => {
    const keyword = kw.replace(/^hire\s+/i, '').toLowerCase();
    if (titleLower.includes(keyword)) score += 10;
    
    // Count occurrences in description
    const count = (descLower.match(new RegExp(keyword, "g")) || []).length;
    if (count >= 2) score += 5;
    if (count >= 4) score += 5;
  });

  return Math.min(Math.round(score), 100);
}
