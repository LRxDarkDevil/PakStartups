# 🚩 Platform Completion Checklist: Missing Pages & Assets

This document is the master audit and checklist for reaching feature parity between the **Stitch Prototypes** and the **Next.js Implementation**. 

---

## 🏗️ 1. Admin Management Suite (`/admin`)
The current admin dashboard only implements the "Startup Queue." The following sidebar modules are missing:
- [ ] **Overview / Dashboard Stats** (`/admin/dashboard` or `/admin`)
- [ ] **User Management** (`/admin/users`) - Table for managing platform users.
- [ ] **Blog & Stories Review** (`/admin/blog`) - Approval queue for founder stories.
- [ ] **Volunteer Apps Review** (`/admin/volunteers`) - Approval queue for ambassadors.
- [ ] **Events & Meetups Management** (`/admin/events`) - Propose/Review event flow.
- [ ] **Reports & Platform Metrics** (`/admin/reports`)
- [ ] **Analytics Engine** (`/admin/analytics`)

## ⚙️ 2. Account & Settings (`/settings`)
Only the basic Profile information exists. The following sub-sections from the design are missing:
- [ ] **Skills & Interests** (`/settings/skills`) - Tag selection for co-founder matchmaking.
- [ ] **Social Accounts Integration** (`/settings/social`) - LinkedIn, Twitter, Github links.
- [ ] **Notification Preferences** (`/settings/notifications`)
- [ ] **Privacy Controls** (`/settings/privacy`)
- [ ] **Security & Password** (`/settings/security`)
- [ ] **Danger Zone** (`/settings/danger`) - Account deletion / Export data.

## 💡 3. Idea Validation Tooling (`/ideas`)
The "Idea Validation" area has several interactive tabs designed that aren't functional:
- [ ] **Submission Flow** (`/ideas/submit`) - Create a new idea.
- [ ] **Feasibility Tool** (`/ideas/feasibility`) - Interactive AI-driven scoring engine.
- [ ] **Survey Builder** (`/ideas/survey`) - Rapid validation form generator.
- [ ] **MVP Resources Library** (`/ideas/resources`) - Static collection of playbooks.

## 🤝 4. Co-Founder Matchmaking (`/match`)
Missing the management of networking requests:
- [ ] **Connection Requests Inbox** (`/match/requests`) - Sent/Received requests.
- [ ] **Saved Founder Profiles** (`/match/saved`) - Bookmark directory.

## 🏢 5. B2B Marketplace & Ecosystem (`/b2b`)
- [ ] **List a Solution** (`/b2b/list-solution`) - Form to join as a service provider.
- [ ] **AI Matches Dashboard** (`/b2b/matches`) - Profile-based matching UI.
- [ ] **Add Organization** (`/ecosystem/add`) - Form to add new incubators/hubs to directory.
- [ ] **City/Region Result Pages** (`/ecosystem/[region]`)

## 📚 6. Knowledge Hub & Content (`/knowledge`)
The "Knowledge Hub" landing page has four major action blocks that need landing sub-routes:
- [ ] **Learning Guides Archive** (`/knowledge/guides`)
- [ ] **Operational Toolkit** (`/knowledge/toolkit`) - Calculators, templates.
- [ ] **Market Intelligence Reports** (`/knowledge/reports`)
- [ ] **Resource/Grant Directory** (`/knowledge/directory`)

## 🚀 7. Startup Submission & Profiles
- [ ] **Multi-Step Flow Completion**: Steps 2 (Team/Equity) and 3 (Review/Legal).
- [ ] **Startup Detail Sub-tabs**: Updates, Product Roadmap, and Connect.

## ⚖️ 8. Legal & Foundation
Essential pages for production deployment:
- [ ] **About Us** (`/about`)
- [ ] **Privacy Policy** (`/privacy`)
- [ ] **Terms of Service** (`/terms`)
- [ ] **Support / Help Center** (`/support`)

---

## 🎨 Note on Pure Filters
The following are **React-state filters** and do not require new files, only data fetching logic:
- `Startups Directory`: Recently Added, Trending, By Industry.
- `Notifications`: Connections, System, Events.
- `Blog`: Founder Journeys vs Case Studies.
