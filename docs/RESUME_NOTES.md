# Resume and Interview Notes

## Short Resume Bullet

Built Aegis Web Review, a React and TypeScript security review dashboard that evaluates AI-generated websites for security, privacy, compliance, and AI trust risk signals.

## Stronger Resume Bullets

- Designed and built a website review tool for AI-generated sites, focused on identifying launch-readiness risks across security, privacy, compliance, and AI trust categories.
- Developed a React and TypeScript dashboard that presents severity-based findings, category scoring, and plain-English remediation guidance.
- Planned a deterministic scanner engine to evaluate website headers, HTML, policy links, forms, scripts, tracking behavior, and AI-related disclosure risks.
- Documented product scope, safety boundaries, scanner architecture, roadmap, and compliance-risk language for a GitHub-ready portfolio project.

## Interview Explanation

Aegis Web Review is a project I built around a problem I noticed with AI-generated websites. AI tools can create polished-looking sites very quickly, but the output often skips important security and trust details, such as privacy policies, terms of service, security headers, safe data handling language, and AI-use disclaimers.

The goal of the project is to give builders a pre-launch review tool. A user enters a website URL, and the scanner evaluates the site for common risk signals. The dashboard then explains each finding in plain English and suggests practical fixes.

The project is intentionally scoped as a first-pass review tool, not a legal certification system or penetration testing replacement.

## Technical Talking Points

- React and TypeScript frontend.
- Vite development environment.
- Component-based dashboard UI.
- Severity-based findings model.
- Planned deterministic rule engine.
- Planned website evidence collection from headers, HTML, links, forms, and scripts.
- Risk categories for security, privacy, compliance, and AI trust.
- Safety boundary for authorized, passive review.

## Product Talking Points

- Helps AI website builders catch obvious risks before launch.
- Makes security and compliance concepts easier for beginners to understand.
- Avoids overclaiming by labeling legal issues as risk signals.
- Designed for GitHub presentation, demo screenshots, and interview discussion.

## Honest Current Status

The current version includes the project foundation, dashboard UI, sample findings, and extensive planning documentation. The next implementation milestone is a real website scanner that can fetch a URL and run deterministic checks against the collected page evidence.
