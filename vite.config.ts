import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

type Severity = "Critical" | "High" | "Medium" | "Low" | "Advisory";
type Category = "Security" | "Privacy" | "Compliance" | "AI Trust";
type Confidence = "High" | "Medium" | "Low";
type Difficulty = "Easy" | "Medium" | "Hard";
type BusinessImpact = "Launch blocker" | "Trust gap" | "Technical hardening" | "Manual review";

type Reference = {
  label: string;
  url: string;
  note: string;
};

type Finding = {
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

type PageEvidence = {
  url: string;
  status: number;
  html: string;
  text: string;
  links: string[];
  scripts: string[];
  forms: number;
};

const categories: Category[] = ["Security", "Privacy", "Compliance", "AI Trust"];

const references = {
  owaspHeaders: {
    label: "OWASP Secure Headers Project",
    url: "https://owasp.org/www-project-secure-headers/",
    note: "Security header hardening guidance.",
  },
  ftcPrivacy: {
    label: "FTC Privacy and Security Guidance",
    url: "https://www.ftc.gov/business-guidance/privacy-security",
    note: "US business guidance for privacy and data security practices.",
  },
  ccpa: {
    label: "California Consumer Privacy Act (CCPA)",
    url: "https://oag.ca.gov/privacy/ccpa",
    note: "California privacy-rights framework that may apply to qualifying businesses.",
  },
  gdpr: {
    label: "EU GDPR Regulation Text",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    note: "EU data-protection rules that may apply when handling EU personal data.",
  },
  ftcAdvertising: {
    label: "FTC Advertising and Marketing Guidance",
    url: "https://www.ftc.gov/business-guidance/advertising-marketing",
    note: "Guidance around claims, disclosures, endorsements, and marketing practices.",
  },
  nistAiRmf: {
    label: "NIST AI Risk Management Framework",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    note: "AI risk and trustworthiness framework.",
  },
  wcag: {
    label: "W3C WCAG Accessibility Guidelines",
    url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    note: "Accessibility standard often used for web compliance and procurement review.",
  },
  termsContracts: {
    label: "FTC Business Guidance: Advertising and Consumer Protection",
    url: "https://www.ftc.gov/business-guidance",
    note: "Starting point for consumer-protection obligations that Terms alone do not replace.",
  },
};
const categoryWeights: Record<Category, number> = {
  Security: 40,
  Privacy: 25,
  Compliance: 20,
  "AI Trust": 15,
};

const securityHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

const trackerPatterns = [
  "googletagmanager.com",
  "google-analytics.com",
  "analytics.google.com",
  "facebook.net",
  "connect.facebook.net",
  "hotjar.com",
  "clarity.ms",
  "segment.com",
  "mixpanel.com",
  "plausible.io",
];

const severityPenalty: Record<Severity, number> = {
  Critical: 38,
  High: 28,
  Medium: 18,
  Low: 9,
  Advisory: 5,
};

const confidenceMultiplier: Record<Confidence, number> = {
  High: 1,
  Medium: 0.78,
  Low: 0.5,
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinks(html: string) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
}

function extractScripts(html: string) {
  return [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map((match) =>
    match[1].toLowerCase(),
  );
}

function countForms(html: string) {
  return (html.match(/<form\b/gi) ?? []).length;
}

function snippet(text: string, pattern: RegExp, fallback: string) {
  const match = pattern.exec(text);
  if (!match?.index) return fallback;
  const start = Math.max(0, match.index - 90);
  const end = Math.min(text.length, match.index + 170);
  return text.slice(start, end).trim();
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function calculateGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function verdict(score: number) {
  if (score >= 90) return "Ready to launch with routine monitoring.";
  if (score >= 80) return "Strong posture with a few review items.";
  if (score >= 70) return "Promising, but fix trust gaps before a public launch.";
  if (score >= 60) return "Needs cleanup before launch.";
  return "High review priority before launch.";
}

function calculateCategoryScores(findings: Finding[]) {
  const scores = Object.fromEntries(categories.map((category) => [category, 100])) as Record<Category, number>;

  for (const finding of findings) {
    const impactMultiplier = finding.businessImpact === "Launch blocker" ? 1.35 : finding.businessImpact === "Trust gap" ? 1.15 : finding.businessImpact === "Manual review" ? 1.05 : 1;
    scores[finding.category] -= severityPenalty[finding.severity] * confidenceMultiplier[finding.confidence] * impactMultiplier;
  }

  for (const category of categories) {
    scores[category] = Math.max(0, Math.round(scores[category]));
  }

  const overall = Math.round(
    categories.reduce((total, category) => total + scores[category] * (categoryWeights[category] / 100), 0),
  );

  return { overall, categories: scores };
}

async function fetchPage(url: string): Promise<PageEvidence | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "Aegis-Web-Review/0.3 passive scanner",
        accept: "text/html,application/xhtml+xml",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) return null;

    const html = await response.text();
    return {
      url: response.url,
      status: response.status,
      html,
      text: stripHtml(html),
      links: extractLinks(html),
      scripts: extractScripts(html),
      forms: countForms(html),
    };
  } catch {
    return null;
  }
}

function resolveInternalLinks(homeUrl: string, links: string[]) {
  const origin = new URL(homeUrl).origin;
  const priority = /privacy|terms|tos|contact|pricing|signup|login|account|about|cookie|refund|returns/i;

  return unique(
    links
      .map((link) => {
        try {
          return new URL(link, homeUrl).href;
        } catch {
          return "";
        }
      })
      .filter((url) => url.startsWith(origin) && priority.test(url))
      .slice(0, 8),
  );
}

function detectSiteProfile(allText: string, pages: PageEvidence[], trackers: string[]) {
  const text = allText.toLowerCase();
  const hasPayment = /pricing|checkout|subscription|billing|refund|cart|buy now|payment/.test(text);
  const hasAi = /\bai\b|chatbot|assistant|automated advice|generated advice|machine learning/.test(text);
  const hasHealth = /doctor|medical|diagnose|therapy|mental health|symptom|treatment|fitness/.test(text);
  const hasFinance = /finance|investment|loan|credit|crypto|trading|insurance|tax/.test(text);
  const hasEducation = /course|student|school|lesson|tutor|education/.test(text);
  const hasMarketplace = /seller|vendor|marketplace|booking|listing/.test(text);
  const forms = pages.reduce((total, page) => total + page.forms, 0);

  let siteType = "General website";
  if (hasAi) siteType = "AI tool or AI-assisted site";
  else if (hasPayment && /cart|checkout|product/.test(text)) siteType = "Ecommerce";
  else if (hasPayment) siteType = "SaaS or paid service";
  else if (hasEducation) siteType = "Education";
  else if (hasMarketplace) siteType = "Marketplace";
  else if (/portfolio|resume|case study/.test(text)) siteType = "Portfolio";

  const regulatedRisk = hasHealth || hasFinance || /legal advice|lawyer|attorney|employment|hiring|children|minor/.test(text)
    ? "Elevated"
    : "Normal";

  return {
    siteType,
    dataCollection: forms > 0 ? "Forms detected" : "No forms detected",
    tracking: trackers.length > 0 ? `${trackers.length} tracker signal(s)` : "No known trackers detected",
    aiFeatures: hasAi ? "AI language detected" : "No obvious AI feature language",
    regulatedRisk,
    businessModel: hasPayment ? "Paid or commercial signals" : "No payment signals detected",
  };
}


function calculateReliabilityScore(input: {
  parsedUrl: URL;
  findings: Finding[];
  presentHeaders: string[];
  hasPrivacy: boolean;
  hasTerms: boolean;
  hasContact: boolean;
  pagesScanned: number;
  status: number;
}) {
  let score = 50;

  if (input.parsedUrl.protocol === "https:") score += 18;
  score += Math.min(14, input.presentHeaders.length * 2.5);
  if (input.hasPrivacy) score += 8;
  if (input.hasTerms) score += 8;
  if (input.hasContact) score += 4;
  if (input.status >= 200 && input.status < 400) score += 5;
  score += Math.min(6, input.pagesScanned * 1.5);

  const confirmedRiskPenalty = input.findings.reduce((total, finding) => {
    if (finding.confidence === "Low") return total;
    if (finding.severity === "Critical") return total + 18;
    if (finding.severity === "High") return total + 12;
    if (finding.severity === "Medium") return total + 5;
    return total + 1;
  }, 0);

  return Math.max(0, Math.min(100, Math.round(score - confirmedRiskPenalty)));
}

function reliabilityLabel(score: number) {
  if (score >= 95) return "Very high observed reliability";
  if (score >= 85) return "High observed reliability";
  if (score >= 70) return "Moderate observed reliability";
  return "Limited observed reliability";
}
function makeFinding(finding: Finding): Finding {
  return finding;
}

async function scanWebsite(rawTarget: string) {
  const normalizedTarget = /^https?:\/\//i.test(rawTarget) ? rawTarget : `https://${rawTarget}`;
  const parsedUrl = new URL(normalizedTarget);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only http and https URLs can be scanned.");
  }

  const homeResponse = await fetch(parsedUrl, {
    redirect: "follow",
    headers: {
      "user-agent": "Aegis-Web-Review/0.3 passive scanner",
      accept: "text/html,application/xhtml+xml",
    },
  });

  const homeHtml = await homeResponse.text();
  const homePage: PageEvidence = {
    url: homeResponse.url,
    status: homeResponse.status,
    html: homeHtml,
    text: stripHtml(homeHtml),
    links: extractLinks(homeHtml),
    scripts: extractScripts(homeHtml),
    forms: countForms(homeHtml),
  };

  const followUrls = resolveInternalLinks(homePage.url, homePage.links).filter((url) => url !== homePage.url).slice(0, 5);
  const followedPages = (await Promise.all(followUrls.map(fetchPage))).filter(Boolean) as PageEvidence[];
  const pages = [homePage, ...followedPages];
  const allLinks = unique(pages.flatMap((page) => page.links.map((link) => link.toLowerCase())));
  const allText = pages.map((page) => page.text).join(" ");
  const allHtml = pages.map((page) => page.html).join("\n");
  const scripts = unique(pages.flatMap((page) => page.scripts));
  const formsFound = pages.reduce((total, page) => total + page.forms, 0);
  const findings: Finding[] = [];
  const headerNames = [...homeResponse.headers.keys()].map((header) => header.toLowerCase());
  const missingHeaders = securityHeaders.filter((header) => !homeResponse.headers.has(header));
  const presentHeaders = securityHeaders.filter((header) => homeResponse.headers.has(header));
  const trackers = scripts.filter((script) => trackerPatterns.some((pattern) => script.includes(pattern)));
  const profile = detectSiteProfile(allText, pages, trackers);
  const hasPrivacy = allLinks.some((link) => /privacy|privacy-policy|data-policy/.test(link));
  const hasTerms = allLinks.some((link) => /terms|tos|terms-of-service|terms-and-conditions/.test(link));
  const hasCookieLanguage = /cookie|cookies|tracking|analytics|consent/i.test(allText);
  const hasRefund = /refund|cancellation|cancel subscription|returns/i.test(allText);
  const hasContact = /contact|support|help@|support@|mailto:/i.test(allHtml);

  if (parsedUrl.protocol !== "https:") {
    findings.push(makeFinding({
      id: "security-https",
      title: "Site is not using HTTPS",
      severity: "High",
      category: "Security",
      confidence: "High",
      difficulty: "Medium",
      businessImpact: "Launch blocker",
      evidence: parsedUrl.href,
      evidenceSnippet: parsedUrl.href,
      pageUrl: homePage.url,
      summary: "The scanned URL uses HTTP instead of HTTPS.",
      impact: "Visitors may be exposed to traffic interception, content tampering, browser warnings, and lower trust during checkout, login, or form submission.",
      fix: "Serve the site over HTTPS and redirect all HTTP traffic to HTTPS.",
      steps: ["Enable TLS/SSL through the hosting provider or CDN.", "Force HTTP-to-HTTPS redirects for every route.", "Retest the URL and confirm the final scanned URL starts with https://."],
      references: [references.owaspHeaders],
    }));
  }

  if (missingHeaders.length > 0) {
    findings.push(makeFinding({
      id: "security-headers",
      title: "Security header coverage can be improved",
      severity: missingHeaders.includes("content-security-policy") ? "Low" : "Advisory",
      category: "Security",
      confidence: "Medium",
      difficulty: "Medium",
      businessImpact: "Technical hardening",
      evidence: `Missing: ${missingHeaders.join(", ")}. Present: ${presentHeaders.join(", ") || "none detected"}`,
      evidenceSnippet: missingHeaders.join(", "),
      pageUrl: homePage.url,
      summary: "Some recommended browser security headers were not visible on the homepage response.",
      impact: "This does not automatically mean the site is unsafe, but missing headers can reduce protection against clickjacking, MIME sniffing, referrer leakage, or script injection damage.",
      fix: "Add the missing headers in the hosting platform, CDN, reverse proxy, or framework config.",
      steps: ["Start with X-Content-Type-Options: nosniff and Referrer-Policy: strict-origin-when-cross-origin.", "Control embedding with X-Frame-Options or a CSP frame-ancestors rule.", "Roll out Content-Security-Policy gradually so scripts and payments do not break.", "Use Strict-Transport-Security after HTTPS is confirmed everywhere."],
      references: [references.owaspHeaders],
    }));
  }

  if (!hasPrivacy) {
    const hasDataCollection = formsFound > 0 || trackers.length > 0;
    findings.push(makeFinding({
      id: "privacy-policy",
      title: "Privacy Policy link was not found",
      severity: hasDataCollection ? "Medium" : "Advisory",
      category: "Privacy",
      confidence: hasDataCollection ? "Medium" : "Low",
      difficulty: "Easy",
      businessImpact: hasDataCollection ? "Trust gap" : "Manual review",
      evidence: `${allLinks.length} links inspected across ${pages.length} page(s)`,
      evidenceSnippet: "No privacy-policy style link found in scanned pages.",
      pageUrl: homePage.url,
      summary: hasDataCollection ? "The scanned pages appear to collect data or load tracking scripts, but a Privacy Policy link was not detected." : "A Privacy Policy link was not detected in the scanned pages.",
      impact: "A missing or hard-to-find Privacy Policy can hurt user trust and may create legal or platform-review risk when the site collects emails, analytics data, uploads, messages, or account information.",
      fix: "Add a clear Privacy Policy link in the footer or navigation.",
      steps: ["Create a Privacy Policy page that explains what data is collected.", "Describe why the data is collected and which third parties receive it.", "Link the policy from the footer and near data collection forms.", "Add a contact email for privacy questions or deletion requests."],
      references: [references.ftcPrivacy, references.ccpa, references.gdpr],
    }));
  }

  if (!hasTerms) {
    const commercial = profile.businessModel.includes("Paid") || formsFound > 0 || profile.aiFeatures.includes("AI");
    findings.push(makeFinding({
      id: "terms-link",
      title: "Terms of Service link was not found",
      severity: commercial ? "Medium" : "Low",
      category: "Compliance",
      confidence: commercial ? "High" : "Medium",
      difficulty: "Easy",
      businessImpact: commercial ? "Launch blocker" : "Trust gap",
      evidence: `${allLinks.length} links inspected across ${pages.length} page(s)`,
      evidenceSnippet: "No terms/tos style link found in scanned pages.",
      pageUrl: homePage.url,
      summary: "The scanner did not find an obvious Terms, ToS, or Terms and Conditions link.",
      impact: "Terms define acceptable use, liability limits, payment rules, user-content rights, dispute handling, and AI-output responsibility. Missing Terms can create expensive ambiguity if a customer disputes payment, misuses the service, relies on AI output, or challenges ownership of submitted content.",
      fix: "Add Terms of Service if the site provides an app, paid product, user accounts, AI output, or user-submitted content.",
      steps: ["Create a Terms page that explains acceptable use and service limitations.", "Include payment, subscription, refund, or cancellation terms if relevant.", "Explain responsibility for user-submitted content and AI-generated output.", "Link the Terms page from the footer and signup or checkout flows."],
      references: [references.termsContracts, references.ftcAdvertising],
    }));
  }

  if (formsFound > 0 && !/privacy|consent|agree|data|terms|unsubscribe|marketing/i.test(allText)) {
    findings.push(makeFinding({
      id: "form-data-notice",
      title: "Forms may need clearer data-use language",
      severity: "Medium",
      category: "Privacy",
      confidence: "Medium",
      difficulty: "Easy",
      businessImpact: "Trust gap",
      evidence: `${formsFound} form element(s) found across scanned pages`,
      evidenceSnippet: snippet(allText, /email|message|submit|contact|newsletter/i, "Form detected, but nearby visible text could not be isolated."),
      pageUrl: homePage.url,
      summary: "The scanned pages include forms, but obvious privacy, consent, unsubscribe, or data-use language was not detected.",
      impact: "Users may not understand what happens after they submit personal information such as email, name, messages, files, or business details.",
      fix: "Add short, human-readable data-use text near each form.",
      steps: ["Add a one-sentence notice under the form submit button.", "Link to the Privacy Policy next to the form.", "For newsletters, mention unsubscribe or marketing consent.", "For uploads or sensitive messages, explain retention and review process."],
      references: [references.ftcPrivacy, references.ccpa, references.gdpr],
    }));
  }

  if (trackers.length > 0 && !hasCookieLanguage) {
    findings.push(makeFinding({
      id: "tracking-disclosure",
      title: "Tracking scripts detected without obvious disclosure",
      severity: "Low",
      category: "Privacy",
      confidence: "Medium",
      difficulty: "Easy",
      businessImpact: "Trust gap",
      evidence: trackers.slice(0, 4).join(", "),
      evidenceSnippet: trackers[0] ?? "Known tracker script detected.",
      pageUrl: homePage.url,
      summary: "Known analytics or tracking scripts were found, but cookie, analytics, tracking, or consent language was not detected in scanned text.",
      impact: "This can create trust issues and may require additional disclosure depending on the audience, location, and type of tracking used.",
      fix: "Disclose analytics and tracking in the Privacy Policy and add cookie consent where required.",
      steps: ["List analytics and advertising tools in the Privacy Policy.", "Explain what data is collected and why.", "Add a cookie banner or consent manager if the site targets regions that require it.", "Offer opt-out instructions when appropriate."],
      references: [references.ftcPrivacy, references.ccpa, references.gdpr],
    }));
  }

  if (profile.aiFeatures.includes("AI")) {
    const hasDisclaimer = /not legal advice|not medical advice|verify|human review|ai disclaimer|may be inaccurate|limitations/i.test(allText);
    if (!hasDisclaimer) {
      findings.push(makeFinding({
        id: "ai-disclaimer",
        title: "AI-related feature or copy may need a disclaimer",
        severity: profile.regulatedRisk === "Elevated" ? "Medium" : "Low",
        category: "AI Trust",
        confidence: "Medium",
        difficulty: "Easy",
        businessImpact: "Trust gap",
        evidence: "AI-related language found in scanned pages",
        evidenceSnippet: snippet(allText, /\bai\b|chatbot|assistant|automated advice|generated advice|machine learning/i, "AI-related language detected."),
        pageUrl: homePage.url,
        summary: "The site appears to mention AI, chatbot, assistant, or generated advice functionality, but no clear limitation disclaimer was detected.",
        impact: "Users may overtrust generated output, especially if the site discusses medical, legal, financial, hiring, education, or safety topics.",
        fix: "Add a visible AI disclosure and limitation notice near the AI feature or in the footer.",
        steps: ["State that AI output can be incomplete or inaccurate.", "Tell users when human review is required.", "Avoid presenting generated content as professional advice.", "Add stronger disclaimers for regulated topics."],
      references: [references.nistAiRmf, references.ftcAdvertising],
      }));
    }
  }

  if (/guaranteed|cure|diagnose|legal advice|financial advice|100% accurate|risk-free/i.test(allText)) {
    findings.push(makeFinding({
      id: "risky-claims",
      title: "Potentially risky claim language detected",
      severity: "Medium",
      category: "Compliance",
      confidence: "Medium",
      difficulty: "Medium",
      businessImpact: "Manual review",
      evidence: "High-risk claim language found in scanned text",
      evidenceSnippet: snippet(allText, /guaranteed|cure|diagnose|legal advice|financial advice|100% accurate|risk-free/i, "Risky claim language detected."),
      pageUrl: homePage.url,
      summary: "The scanned text appears to contain strong guarantee, medical, legal, financial, accuracy, or risk-free language.",
      impact: "Strong claims may need substantiation, disclaimers, or professional review before launch.",
      fix: "Review claims with a qualified professional and soften wording where needed.",
      steps: ["Find the exact claim in the page copy.", "Replace absolute language with accurate, supportable wording.", "Add disclaimers for medical, legal, financial, or safety-related content.", "Keep proof, case studies, or supporting evidence for claims you keep."],
      references: [references.ftcAdvertising],
    }));
  }

  if (profile.businessModel.includes("Paid") && !hasRefund) {
    findings.push(makeFinding({
      id: "refund-policy",
      title: "Paid-site signals found without refund or cancellation language",
      severity: "Low",
      category: "Compliance",
      confidence: "Medium",
      difficulty: "Easy",
      businessImpact: "Trust gap",
      evidence: "Pricing, checkout, subscription, billing, or payment language detected",
      evidenceSnippet: snippet(allText, /pricing|checkout|subscription|billing|refund|cart|buy now|payment/i, "Commercial language detected."),
      pageUrl: homePage.url,
      summary: "The site appears commercial, but refund, returns, or cancellation language was not detected in the scanned pages.",
      impact: "Paid products usually need clear customer expectations around billing, renewals, refunds, returns, and cancellation.",
      fix: "Add refund, cancellation, or billing terms where relevant.",
      steps: ["Add refund/cancellation language to Terms or a dedicated policy page.", "Link it from pricing or checkout pages.", "Clarify renewal timing for subscriptions.", "Include a support contact for billing questions."],
      references: [references.termsContracts, references.ftcAdvertising],
    }));
  }

  if (!hasContact) {
    findings.push(makeFinding({
      id: "contact-path",
      title: "Clear support or contact path was not found",
      severity: "Advisory",
      category: "Compliance",
      confidence: "Low",
      difficulty: "Easy",
      businessImpact: "Trust gap",
      evidence: "No obvious contact/support link or email found in scanned pages",
      evidenceSnippet: "No contact, support, help email, or mailto link detected.",
      pageUrl: homePage.url,
      summary: "The scanner did not find an obvious way for users to contact the site owner or support team.",
      impact: "Missing contact paths can lower user trust and make privacy, billing, or safety issues harder to resolve.",
      fix: "Add a contact or support link in the footer.",
      steps: ["Add a Contact or Support page.", "Include a support email or form.", "Link contact information from the footer.", "Mention privacy or billing contact paths in policies."],
      references: [references.ftcPrivacy, references.termsContracts],
    }));
  }

  const score = calculateCategoryScores(findings);
  const reliabilityScore = calculateReliabilityScore({ parsedUrl, findings, presentHeaders, hasPrivacy, hasTerms, hasContact, pagesScanned: pages.length, status: homeResponse.status });
  const sorted = [...findings].sort((a, b) => severityPenalty[b.severity] - severityPenalty[a.severity]);
  const topPriorities = sorted.filter((finding) => finding.severity !== "Advisory").slice(0, 3).map((finding) => finding.title);
  const quickWins = sorted.filter((finding) => finding.difficulty === "Easy").slice(0, 4).map((finding) => finding.fix);

  return {
    targetUrl: parsedUrl.href,
    scannedAt: new Date().toISOString(),
    score: score.overall,
    grade: calculateGrade(score.overall),
    verdict: verdict(score.overall),
    reliabilityScore,
    reliabilityLabel: reliabilityLabel(reliabilityScore),
    categoryScores: score.categories,
    topPriorities,
    quickWins,
    siteProfile: profile,
    scannedPages: pages.map((page) => ({ url: page.url, status: page.status, links: page.links.length, forms: page.forms, scripts: page.scripts.length })),
    findings,
    evidence: {
      finalUrl: homeResponse.url,
      status: homeResponse.status,
      headersChecked: headerNames,
      linksFound: allLinks.length,
      formsFound,
      scriptsFound: scripts.length,
      presentSecurityHeaders: presentHeaders,
      missingSecurityHeaders: missingHeaders,
      trackersFound: trackers.length,
      pagesScanned: pages.length,
    },
  };
}

const scanApiPlugin = {
  name: "aegis-scan-api",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use("/api/scan", async (req, res) => {
      try {
        const requestUrl = new URL(req.url ?? "", "http://localhost");
        const target = requestUrl.searchParams.get("url");

        if (!target) {
          res.statusCode = 400;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: "Missing url parameter." }));
          return;
        }

        const report = await scanWebsite(target);
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(report));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Scan failed." }));
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), scanApiPlugin],
  server: {
    host: "0.0.0.0",
  },
});






