# Aegis Web Review: Project Brief

## Overview

Aegis Web Review is a security, privacy, and compliance risk review tool for AI-generated websites.

The project is designed for developers, students, founders, and builders who create websites with AI tools such as ChatGPT, v0, Lovable, Bolt, Cursor, Replit, and similar platforms. These tools can produce polished interfaces quickly, but the generated sites may still contain security weaknesses, privacy gaps, missing legal pages, unsafe data handling patterns, or unclear AI-use disclosures.

Aegis Web Review helps bridge that gap by scanning a website and producing a plain-English readiness report before launch.

## One-Sentence Pitch

Aegis Web Review scans AI-generated websites for common security, privacy, and compliance risk signals, then explains what to fix before shipping.

## Problem Statement

AI-generated websites are increasingly easy to build, but many builders do not have the security or compliance background needed to evaluate whether their site is safe, trustworthy, or launch-ready.

Common issues include:

- Missing privacy policies or terms of service.
- Contact forms that collect user data without explaining how that data is used.
- Missing cookie or tracking disclosures.
- Weak security headers.
- Exposed API keys or secrets in frontend code.
- Unsafe third-party scripts.
- AI chatbot or advice features without disclaimers.
- Login or admin pages exposed without clear access controls.
- Risky claims, such as medical, legal, financial, or guaranteed outcome language.

The goal of Aegis Web Review is not to provide legal certification or replace professional security audits. Instead, it gives builders an accessible first-pass review so they can identify obvious risks early.

## Target Users

- Developers building websites with AI coding tools.
- Startup founders launching quick MVPs.
- Students building portfolio projects.
- Freelancers delivering websites to clients.
- Non-security engineers who want a pre-launch checklist.

## Product Positioning

Aegis Web Review sits between a basic website checklist and a professional security audit.

It is intended to be:

- Easier to understand than traditional security scanners.
- More relevant to AI-built websites than generic linting tools.
- More practical than a static compliance checklist.
- Clear enough for beginners but technical enough to be credible on GitHub and in interviews.

## MVP Scope

The MVP focuses on a demo-ready website scanner experience:

- URL input for a target website.
- Security, privacy, compliance, and AI trust categories.
- Deterministic scanner checks.
- Severity labels and risk scoring.
- Plain-English explanations.
- Actionable remediation guidance.
- Professional dashboard UI.
- Strong documentation and roadmap.

## Non-Goals

The MVP will not attempt to:

- Certify legal compliance.
- Exploit vulnerabilities.
- Attack websites.
- Replace legal counsel.
- Replace a professional penetration test.
- Scan private systems without authorization.
- Provide full CVE database coverage.

## Safety Boundary

Aegis Web Review is for authorized review only. It should be used on:

- Websites the user owns.
- Client sites the user has permission to assess.
- Test websites.
- Intentionally vulnerable demo apps.
- Public pages where passive review is appropriate.

The tool should avoid destructive testing, credential attacks, denial-of-service behavior, automated exploitation, or stealth scanning.

## Resume-Friendly Summary

Built a React and TypeScript web security review dashboard for AI-generated websites, designed to detect security, privacy, compliance, and AI trust risk signals using deterministic scanner rules and plain-English remediation guidance.
