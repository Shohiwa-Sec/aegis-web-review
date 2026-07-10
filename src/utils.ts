/*
 Shared types and small utilities for Aegis app.
 Casual comments kept friendly but useful.
*/

// Basic domain types
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Advisory";
export type Category = "Security" | "Privacy" | "Compliance" | "AI Trust";
export type Confidence = "High" | "Medium" | "Low";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type BusinessImpact = "Launch blocker" | "Trust gap" | "Technical hardening" | "Manual review";

export type Reference = {
  label: string;
  url: string;
  note: string;
};

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  category: Category;
  confidence: Confidence;
  difficulty: Difficulty;
  businessImpact: BusinessImpact;
  evidence: string;
  evidenceSnippet: string;
  pageUrl: string;
  summary: string;
  impact: string;
  fix: string;
  steps: string[];
  references: Reference[];
};

export type SiteProfile = {
  siteType: string;
  dataCollection: string;
  tracking: string;
  aiFeatures: string;
  regulatedRisk: string;
  businessModel: string;
};

export type ScanReport = {
  targetUrl: string;
  scannedAt: string;
  score: number;
  grade: string;
  verdict: string;
  reliabilityScore: number;
  reliabilityLabel: string;
  categoryScores: Record<Category, number>;
  topPriorities: string[];
  quickWins: string[];
  siteProfile: SiteProfile;
  scannedPages: Array<{ url: string; status: number; links: number; forms: number; scripts: number }>;
  findings: Finding[];
  evidence: {
    finalUrl: string;
    status: number;
    headersChecked: string[];
    linksFound: number;
    formsFound: number;
    scriptsFound: number;
    presentSecurityHeaders?: string[];
    missingSecurityHeaders?: string[];
    trackersFound?: number;
    pagesScanned?: number;
  };
};

// Small shared constants
export const categories: Category[] = ["Security", "Privacy", "Compliance", "AI Trust"];
export const reportModes = ["Executive", "Analyst", "Assurance"] as const;
export type ReportMode = (typeof reportModes)[number];

// Utilities
export const severityOrder: Record<Severity, number> = { Critical: 5, High: 4, Medium: 3, Low: 2, Advisory: 1 };

export function scoreTone(score: number) {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "watch";
  return "risk";
}

export function categoryFindingCount(report: ScanReport, category: Category) {
  return report.findings.filter((finding) => finding.category === category).length;
}

export function categoryClass(category: Category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function normalizeInputUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
