/*
 Aegis — casual, developer-friendly comments
 Purpose: UI + reporting for passive web scans. Comments are laid-back but helpful.
*/
import { FormEvent, useEffect, useMemo, useState } from "react";

// Severity levels used to rank findings — higher numbers mean more urgent.
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

type SiteProfile = {
  siteType: string;
  dataCollection: string;
  tracking: string;
  aiFeatures: string;
  regulatedRisk: string;
  businessModel: string;
};

type ScanReport = {
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

const categories: Category[] = ["Security", "Privacy", "Compliance", "AI Trust"];
const reportModes = ["Executive", "Analyst", "Assurance"] as const;
type ReportMode = (typeof reportModes)[number];
const historyKey = "aegis.scanHistory";

// Small example reference used in the demo report. Swap or remove for production.
const sampleReference: Reference = {
  label: "FTC Privacy and Security Guidance",
  url: "https://www.ftc.gov/business-guidance/privacy-security",
  note: "US business guidance for privacy and data security practices.",
};

const sampleReport: ScanReport = {
  targetUrl: "https://demo-ai-launch.example",
  scannedAt: new Date().toISOString(),
  score: 82,
  grade: "B",
  verdict: "Strong posture with a few review items.",
  reliabilityScore: 94,
  reliabilityLabel: "High observed reliability",
  categoryScores: { Security: 88, Privacy: 76, Compliance: 78, "AI Trust": 86 },
  topPriorities: ["Privacy Policy link was not found", "Forms may need clearer data-use language"],
  quickWins: ["Add a clear Privacy Policy link in the footer or navigation.", "Add short, human-readable data-use text near each form."],
  siteProfile: {
    siteType: "AI tool or AI-assisted site",
    dataCollection: "Forms detected",
    tracking: "1 tracker signal(s)",
    aiFeatures: "AI language detected",
    regulatedRisk: "Normal",
    businessModel: "No payment signals detected",
  },
  scannedPages: [{ url: "https://demo-ai-launch.example", status: 200, links: 12, forms: 1, scripts: 8 }],
  findings: [
    {
      id: "privacy-policy",
      title: "Privacy Policy link was not found",
      severity: "Medium",
      category: "Privacy",
      confidence: "Medium",
      difficulty: "Easy",
      businessImpact: "Trust gap",
      evidence: "12 links inspected across 1 page",
      evidenceSnippet: "No privacy-policy style link found in scanned pages.",
      pageUrl: "https://demo-ai-launch.example",
      summary: "The scanned pages appear to collect data or load tracking scripts, but a Privacy Policy link was not detected.",
      impact: "A missing or hard-to-find Privacy Policy can hurt user trust and may create legal or platform-review risk.",
      fix: "Add a clear Privacy Policy link in the footer or navigation.",
      steps: ["Create a Privacy Policy page.", "Explain what data is collected.", "Link the policy from footer and forms."],
      references: [sampleReference],
    },
  ],
  evidence: {
    finalUrl: "https://demo-ai-launch.example",
    status: 200,
    headersChecked: ["content-type"],
    linksFound: 12,
    formsFound: 1,
    scriptsFound: 8,
    trackersFound: 1,
    pagesScanned: 1,
  },
};

const severityOrder: Record<Severity, number> = { Critical: 5, High: 4, Medium: 3, Low: 2, Advisory: 1 };

function scoreTone(score: number) {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "watch";
  return "risk";
}

function categoryFindingCount(report: ScanReport, category: Category) {
  return report.findings.filter((finding) => finding.category === category).length;
}

function categoryClass(category: Category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

// Help users by normalizing bare hostnames to full HTTPS URLs.
function normalizeInputUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function executiveSummary(report: ScanReport) {
  if (report.findings.length === 0) {
    return "No launch blockers were detected by the current passive scanner. Keep monitoring policies, headers, and data collection as the site evolves.";
  }

  const priorityText = report.topPriorities.length > 0 ? report.topPriorities.join("; ") : "the listed review items";
  return `Grade ${report.grade}. ${report.verdict} Immediate review queue: ${priorityText}.`;
}

function markdownReport(report: ScanReport) {
  const findings = report.findings
    .map((finding, index) => {
      const refs = finding.references.map((ref) => `     - ${ref.label}: ${ref.url}`).join("\n");
      return `${index + 1}. ${finding.title}\n   - Severity: ${finding.severity}\n   - Category: ${finding.category}\n   - Confidence: ${finding.confidence}\n   - Impact: ${finding.businessImpact}\n   - Fix: ${finding.fix}\n   - References:\n${refs || "     - None"}`;
    })
    .join("\n\n");

  return `# Aegis Web Review Report\n\nTarget: ${report.targetUrl}\nGrade: ${report.grade}\nScore: ${report.score}\nReliability: ${report.reliabilityScore} - ${report.reliabilityLabel}\nVerdict: ${report.verdict}\nScanned: ${new Date(report.scannedAt).toLocaleString()}\n\n## Site Profile\n\n- Type: ${report.siteProfile.siteType}\n- Data collection: ${report.siteProfile.dataCollection}\n- Tracking: ${report.siteProfile.tracking}\n- AI features: ${report.siteProfile.aiFeatures}\n- Regulated topic risk: ${report.siteProfile.regulatedRisk}\n- Business model: ${report.siteProfile.businessModel}\n\n## Top Priorities\n\n${report.topPriorities.map((item) => `- ${item}`).join("\n") || "- No priority items found."}\n\n## Findings\n\n${findings || "No findings in this first-pass scan."}\n\nNote: This report identifies risk signals and is not legal advice or a security certification.\n`;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(historyKey);
    return raw ? (JSON.parse(raw) as ScanReport[]) : [];
  } catch {
    return [];
  }
}

// Main React component: holds local UI state, scan flow, and rendering logic.
// Read through the state hooks to see how data flows — it's fairly straightforward.
function App() {
  const [targetUrl, setTargetUrl] = useState("https://example.com");
  const [report, setReport] = useState<ScanReport>(sampleReport);
  const [history, setHistory] = useState<ScanReport[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ReportMode>("Executive");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const sortedFindings = useMemo(
    () => [...report.findings].sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]),
    [report],
  );

  function rememberScan(nextReport: ScanReport) {
    const nextHistory = [nextReport, ...history.filter((item) => item.targetUrl !== nextReport.targetUrl)].slice(0, 12);
    setHistory(nextHistory);
    localStorage.setItem(historyKey, JSON.stringify(nextHistory));
  }

  // Kick off a scan via the backend API and wire results into state.
// Keeps the UI responsive and stores history for quick recall.
async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsScanning(true);
    setError("");

    const normalizedUrl = normalizeInputUrl(targetUrl);
    setTargetUrl(normalizedUrl);

    try {
      const response = await fetch(`/api/scan?url=${encodeURIComponent(normalizedUrl)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Scan failed.");
      setReport(data);
      setTargetUrl(data.targetUrl);
      rememberScan(data);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed.");
    } finally {
      setIsScanning(false);
    }
  }

  // Export the current report as Markdown so teams can share it easily.
function downloadReport() {
    const blob = new Blob([markdownReport(report)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aegis-web-review-report.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="aegis-console">
      <aside className="rail" aria-label="Aegis navigation">
        <div className="rail-brand"><span>A</span><div><strong>Aegis</strong><small>Web Review</small></div></div>
        <nav>
          <a className="active" href="#mission">Mission</a>
          <a href="#signals">Signals</a>
          <a href="#findings">Findings</a>
          <a href="#history">History</a>
          <a href="#evidence">Evidence</a>
        </nav>
        <div className="rail-footer"><span className="live-dot" />Passive scan mode</div>
      </aside>

      <section className="console-main">
        <header className="command-bar">
          <div><p className="kicker">AI WEBSITE ASSURANCE PLATFORM</p><h1>Aegis Web Review</h1></div>
          <div className="mission-meta">
            <div><span>Grade</span><strong>{report.grade}</strong></div>
            <div><span>Score</span><strong>{report.score}</strong></div>
            <div><span>Reliability</span><strong>{report.reliabilityScore}</strong></div>
          </div>
          <button className="ghost-button" onClick={downloadReport}>Export report</button>
        </header>

        <section className="mission-grid" id="mission">
          <article className="mission-card primary-panel">
            <div className="panel-heading"><span className="panel-index">01</span><div><p className="kicker">Target acquisition</p><h2>Pre-launch trust scan</h2></div></div>
            <p>Scan public pages for security hardening, privacy disclosures, legal readiness, and AI trust signals before an AI-built site ships.</p>
            <form className="scan-command" onSubmit={runScan}>
              <label><span>Website URL</span><input value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="youtube.com" inputMode="url" /></label>
              <button className="execute-button" disabled={isScanning}>{isScanning ? "Scanning target..." : "Execute scan"}</button>
            </form>
            <p className="input-hint">You can type a bare domain like <code>youtube.com</code>. Aegis normalizes it to the full HTTPS URL before scanning.</p>
            {error ? <div className="error-box">{error}</div> : null}
          </article>

          <article className={`verdict-panel ${scoreTone(report.score)}`}>
            <p className="kicker">Aegis verdict</p>
            <div className="grade-lockup"><span>{report.grade}</span><div><strong>{report.score}/100</strong><small>{report.verdict}</small><em>{report.reliabilityLabel}</em></div></div>
            <div className="readiness-rail" aria-label={`Readiness score ${report.score}`}><i style={{ width: `${report.score}%` }} /></div>
            <p>{executiveSummary(report)}</p>
            <div className="reliability-note"><span>Observed reliability</span><strong>{report.reliabilityScore}/100</strong><small>{report.reliabilityLabel}</small></div>
          </article>

          <article className="profile-panel primary-panel">
            <div className="panel-heading"><span className="panel-index">02</span><div><p className="kicker">Site profile</p><h2>{report.siteProfile.siteType}</h2></div></div>
            <div className="profile-list"><span>{report.siteProfile.dataCollection}</span><span>{report.siteProfile.tracking}</span><span>{report.siteProfile.aiFeatures}</span><span>Regulated risk: {report.siteProfile.regulatedRisk}</span><span>{report.siteProfile.businessModel}</span></div>
          </article>
        </section>

        <section className="signal-board" id="signals">
          <div className="section-title"><p className="kicker">Signal matrix</p><h2>Launch readiness by domain</h2></div>
          <div className="signal-grid">
            {categories.map((category) => <article className="signal-card" key={category}><div><span>{category}</span><strong>{report.categoryScores[category]}</strong></div><div className="signal-track"><i className={scoreTone(report.categoryScores[category])} style={{ width: `${report.categoryScores[category]}%` }} /></div><small>{categoryFindingCount(report, category)} review item(s)</small></article>)}
          </div>
        </section>

        <section className="ops-grid">
          <article className="primary-panel"><p className="kicker">Priority queue</p><h2>Fix these first</h2><ol className="priority-list">{(report.topPriorities.length ? report.topPriorities : ["No priority blockers found."]).map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article className="primary-panel"><p className="kicker">Fast remediation</p><h2>Quick wins</h2><ol className="priority-list">{(report.quickWins.length ? report.quickWins : ["No quick wins detected."]).map((item) => <li key={item}>{item}</li>)}</ol></article>
          <article className="primary-panel"><p className="kicker">Analysis pipeline</p><h2>Scan stages</h2><div className="pipeline"><span className="complete">Fetch target</span><span className="complete">Profile site</span><span className="complete">Map signals</span><span className="complete">Rank fixes</span></div></article>
        </section>

        <section className="mode-panel">
          <div className="mode-tabs">{reportModes.map((item) => <button className={mode === item ? "active" : ""} key={item} onClick={() => setMode(item)}>{item}</button>)}</div>
          {mode === "Executive" ? <p>{executiveSummary(report)}</p> : null}
          {mode === "Analyst" ? <p>Scanned {report.evidence.pagesScanned ?? report.scannedPages.length} page(s), {report.evidence.linksFound} links, {report.evidence.formsFound} forms, {report.evidence.scriptsFound} scripts, and {report.evidence.trackersFound ?? 0} tracker signal(s).</p> : null}
          {mode === "Assurance" ? <p>This report identifies risk signals. Laws, regulations, and standards linked below are research starting points, not legal conclusions.</p> : null}
        </section>

        <section className="findings-section" id="findings">
          <div className="section-title"><p className="kicker">Finding register</p><h2>Evidence-backed review items</h2></div>
          <div className="findings-list">
            {sortedFindings.length === 0 ? <article className="finding-card"><h3>No risk signals found in this first-pass scan</h3><p>The scanned pages passed the current passive checks. This is not a security or legal guarantee.</p></article> : sortedFindings.map((finding) => (
              <article className={`finding-card finding-${categoryClass(finding.category)}`} key={finding.id}>
                <div className="finding-card-header"><div className="finding-meta"><span className={`severity severity-${finding.severity.toLowerCase()}`}>{finding.severity}</span><span className={`category-token category-${categoryClass(finding.category)}`}>{finding.category}</span><span>{finding.confidence} confidence</span><span>{finding.difficulty} fix</span><span>{finding.businessImpact}</span></div><code>{finding.evidence}</code></div>
                <h3>{finding.title}</h3><p>{finding.summary}</p>
                <div className="snippet-box"><span>Evidence snippet</span><code>{finding.evidenceSnippet}</code></div>
                <div className="detail-grid"><div><span>Why it matters</span><p>{finding.impact}</p></div><div><span>Recommended fix</span><p>{finding.fix}</p></div></div>
                <div className="steps-box"><span>Fix steps</span><ol>{finding.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                <div className="reference-box"><span>Potentially implicated standards, laws, or guidance</span><div>{finding.references.map((reference) => <a href={reference.url} target="_blank" rel="noreferrer" key={reference.url}><strong>{reference.label}</strong><small>{reference.note}</small></a>)}</div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="history-panel primary-panel" id="history">
          <div className="section-title"><p className="kicker">Scan history</p><h2>Past readiness ratings</h2></div>
          <div className="history-list">
            {history.length === 0 ? <p>No scans saved yet. Run a scan and it will appear here.</p> : history.map((item) => <button key={`${item.targetUrl}-${item.scannedAt}`} onClick={() => { setReport(item); setTargetUrl(item.targetUrl); }}><span>{item.grade}</span><strong>{item.targetUrl}</strong><small>{item.score}/100 readiness - {item.reliabilityScore}/100 reliability - {new Date(item.scannedAt).toLocaleString()}</small></button>)}
          </div>
        </section>

        <section className="evidence-panel" id="evidence"><div className="section-title"><p className="kicker">Raw evidence</p><h2>Scan telemetry</h2></div><div className="telemetry-grid"><span>Final URL</span><code>{report.evidence.finalUrl}</code><span>Status</span><code>{report.evidence.status}</code><span>Links</span><code>{report.evidence.linksFound}</code><span>Forms</span><code>{report.evidence.formsFound}</code><span>Scripts</span><code>{report.evidence.scriptsFound}</code><span>Trackers</span><code>{report.evidence.trackersFound ?? 0}</code></div></section>
      </section>
    </main>
  );
}

export default App;

