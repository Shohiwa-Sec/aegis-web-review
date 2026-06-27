# GitHub Setup Guide

This guide walks through putting Aegis Web Review on your GitHub account.

## 1. Create A GitHub Repository

1. Go to https://github.com/new
2. Repository name suggestion: `aegis-web-review`
3. Description suggestion: `Pre-launch security, privacy, compliance, and AI trust scanner for AI-generated websites.`
4. Set visibility to Public if this is for your portfolio.
5. Do not add a README from GitHub because this project already has one.
6. Click Create repository.

## 2. Open The Project In WSL

```bash
cd "/mnt/c/Users/shohiwa/Documents/AI vulnerability scanner 2"
```

## 3. Initialize Git

```bash
git init
```

## 4. Add A .gitignore

Create a `.gitignore` file before committing. It should exclude generated files and dependencies:

```text
node_modules/
dist/
.env
.env.local
.DS_Store
```

## 5. Check Status

```bash
git status
```

## 6. Add Files

```bash
git add .
```

## 7. Commit

```bash
git commit -m "Initial Aegis Web Review release"
```

## 8. Connect Your GitHub Repo

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aegis-web-review.git
```

## 9. Push

```bash
git push -u origin main
```

If Git asks you to log in, follow the browser/device-code prompt.

## 10. Recommended GitHub Topics

Add these on the GitHub repository page:

- cybersecurity
- compliance
- privacy
- ai-safety
- react
- typescript
- vite
- web-security
- portfolio-project

## 11. Recommended README Screenshot

After the app looks right, take a screenshot of the dashboard and add it to the README later.

Suggested folder:

```text
docs/assets/dashboard.png
```

Then reference it in README:

```md
![Aegis Web Review dashboard](docs/assets/dashboard.png)
```
