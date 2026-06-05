# PakStartups — Audit of Non-Working & Placeholder Items

This document lists all non-working buttons, placeholder metrics, lack of state feedback, and static inputs identified across the **PakStartups** codebase.

---

## 1. Public Site Layout & Navigation

### Footer (`components/layout/Footer.tsx`)
- **Social Links (Lines 24-25):** The Discord and LinkedIn icons/links point to `#` and do not link to real community channels.
- **Legal Templates Link (Line 14):** Points to the generic `/knowledge` Hub landing page instead of a specific templates sub-route.
- **Contact Link (Line 96):** Points to a static `mailto:hello@pakstartups.org` link, which bypasses the existing `/contact` page.

### Admin Layout Header (`app/admin/layout.tsx`)
- **Search Input (Lines 41-48):** The top search bar is a static input with no value state, `onChange` handler, or search execution logic.
- **Notifications Button (Lines 54-56):** The notification icon button has no click handler or dropdown overlay.

---

## 2. Public Pages & Dashboards

### User Dashboard (`app/dashboard/page.tsx`)
- **Profile Views Metric (Line 75):** The value is hardcoded as `–`. Profile views are not tracked in the database or fetched by the page.

### Contact Page (`app/contact/page.tsx`)
- **Form Submission (Lines 10-15):** The input fields (Name, Email, Message text area) do not submit any data. The "Send Email" button is a static `mailto:hello@pakstartups.org` anchor, which opens the default email client with empty fields instead of submitting the form contents.

---

## 3. Co-Founder Matchmaking (`/match` & `/startups/[slug]`)

### Matchmaking Page (`app/match/page.tsx`)
- **Bookmark Icon State (Line 265):** The bookmark button uses a static `bookmark` material icon. There is no conditional logic (e.g., `isBookmarked ? "bookmark" : "bookmark_border"`) to show the user whether they have successfully bookmarked a founder.
- **My Requests & Saved Profiles Tabs (Lines 277-299):** While the main "Browse Matches" tab works, the other tabs do not fetch connection requests or saved profiles dynamically with real-time updates when bookmarks are modified unless the page is reloaded.

### Startup Detail Page (`app/startups/[slug]/page.tsx`)
- **Duplicate Connection Requests (Lines 77-88):** The "Connect with Founder" button does not check Firestore to see if a request has already been sent. This allows users to click the button multiple times and generate duplicate entries in the `connections` collection.
- **Non-Persistent State (Line 35):** The `requestSent` state is purely local to the React session and reset on page refresh. There is no database check on load to disable the button if a request is already pending or accepted.

---

## 4. Account Settings (`/settings`)

### Public Profile / Skills & Interests (`app/settings/skills/page.tsx`)
- **Add Skill Button (Lines 62-64):** The dashed "Add Skill" button has no click handler or input form to allow users to add custom skills to their profile.

### Danger Zone (`app/settings/danger/page.tsx`)
- **Export & Delete Buttons (Lines 15-27):** Both the "Request Data Export" and "Delete Account" buttons are static elements without any `onClick` event handlers or backend integrations.

---

## 5. Idea Validation (`/ideas`)

### Ideas Hub Landing Page (`app/ideas/page.tsx`)
- **Secondary Search Input (Line 191):** The search input located inside the sort/filter bar is a dummy input without state or an `onChange` handler. (Only the main search bar at line 144 works).

### Idea Detail Page (`app/ideas/view/page.tsx`)
- **Upvote/Downvote Feedback (Lines 56-57):** The Upvote and Downvote buttons call Firestore helpers successfully, but do not update the local React state or UI count. The user sees no visual confirmation of their vote without refreshing the page.

### Survey Builder Page (`app/ideas/survey/page.tsx`)
- **Preview Submit (Lines 144-146):** When testing the survey in preview mode, clicking "Submit Response" does nothing. There is no alert or feedback indicating that a mock submission was simulated.

### MVP Resources Page (`app/ideas/resources/page.tsx`)
- **Mock Resources (Lines 82-84):** Resources that are not "Built-in Tools" (e.g. *RICE Matrix*, *Zero-to-MVP in 30 Days*) lack an `href` field in the `ideaResources` collection. The page renders them as unclickable `<div>` containers with no link to download the sheets or PDFs.

---

## 6. Knowledge Hub (`/knowledge`)

### Learning Guides Page (`app/knowledge/guides/page.tsx`)
- **Read Guide CTA (Line 126):** The "Read Guide" button on each card is a static element with no `onClick` handler or link to the actual guide content.

### Operational Toolkit Page (`app/knowledge/toolkit/page.tsx`)
- **Access Tool CTA (Line 105):** The "Access" button on each tool card is a static button with no `onClick` handler or link to download or open the template.

### Market Intelligence Reports Page (`app/knowledge/reports/page.tsx`)
- **Download/View CTA (Lines 85, 146):** The "Download Report" button on the featured card and the "View" buttons on individual report cards have no click handlers or document link mappings.

### Resource Directory Page (`app/knowledge/directory/page.tsx`)
- **Empty Links in Database:** Specific seeded resources (such as *Mentor Capital Network* and *i2i Demo Days*) have empty `link: ""` fields in the `knowledgeResources` collection, making their cards unclickable in the UI.

---

## 7. Startup Directory (`/startups`)

### Startups Page (`app/startups/page.tsx`)
- **No Reset for Category Filter (Lines 155-165):** The page initializes `activeCategory` as `"All"`, but there is no `"All"` button in the category list. Once a user clicks a specific category (e.g., "FinTech"), they cannot clear the filter to view all startups again without refreshing the page.
