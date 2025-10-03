# Events Platform — Frontend

Next.js + Tailwind UI for listing events, viewing details, signing up, and adding to calendar. Admin page allows creating events (with passcode). Backed by the Events Platform API.

## Tech Stack

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- Playwright (E2E)
- Google Calendar link + `.ics` download

## Requirements

- Node.js 20+
- npm
- Deployed or local backend (API base URL)

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE_URL in .env.local

npm run dev
# open http://localhost:3000
Environment
Create /.env.local:

ini
Copy code
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
Example for local dev:

ini
Copy code
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
.env.local example
ini
Copy code
# events-frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
Scripts
bash
Copy code
npm run dev         # start dev server
npm run build       # build for production
npm run start       # start production server (after build)
npm run test:e2e    # run Playwright tests (requires API base URL)
Pages
/ — Events list

/events/[id] — Event detail + signup + calendar buttons

/admin — Create event (requires passcode)

/thanks — Simple confirmation

Features
Fetches events from the backend (GET /events)

Event detail with signup (POST /signups)

After signup: Google Calendar link + .ics download

Admin create event:

Title, description, location, start, end

TMDb search (optional) or manual TMDb movie ID

Passcode required (sent to backend as header there)

Accessibility:

Form labels (<label htmlFor>)

ARIA for errors/status/buttons

Page titles and lang="en" set (_app.tsx and _document.tsx)

Improved contrast on body text and helper text

File Structure (key)
css
Copy code
src/
  components/
    Header.tsx
  lib/
    api.ts
    calendar.ts
    dates.ts
  pages/
    _app.tsx
    _document.tsx
    index.tsx
    admin.tsx
    events/[id].tsx
    thanks.tsx
  styles/
    globals.css
tests/
  events.spec.ts
  events-listing.spec.ts
  event-detail.spec.ts
  signup-validation.spec.ts
  navigation.spec.ts
API Usage
GET /events → array of events

GET /events/:id → single event

POST /signups → { eventId, name, email }

GET /events/:id/ics → .ics file

GET /tmdb/search?q=… → TMDb search proxy (optional)

NEXT_PUBLIC_API_BASE_URL points at the backend root.

Testing (Playwright)
Run all E2E tests:

bash
Copy code
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000 npm run test:e2e
Covers:

Events list renders and links

Event detail renders

Signup success flow

Calendar buttons visible

Basic validation

404 route

Deployment (Netlify)
Connect repo to Netlify

Build command: npm run build

Publish directory: .next

Environment:

NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com

Deploy → verify:

/ lists events

/events/[id] shows signup + calendar buttons

/admin creates event with passcode

Accessibility
_document.tsx sets <Html lang="en">

_app.tsx sets default <title> and meta description

Per-page overrides use next/head

Forms use labels + ARIA (aria-required, aria-invalid, aria-describedby)

Status messages use role="status"

Contrast: avoid light gray on white → use text-gray-700/800

Check with Lighthouse (DevTools → Lighthouse → Accessibility). No “title/lang/contrast” warnings expected.

Troubleshooting
Blank list: check NEXT_PUBLIC_API_BASE_URL and backend CORS

Signup fails: check backend /signups + server logs

Admin create blocked: confirm backend ALLOW_ORIGINS + x-admin-passcode

Calendar buttons missing: only appear after signup success

Lighthouse errors: check _app.tsx and _document.tsx

Notes
Stripe not required for MVP (can add later).

TMDb movieId optional; events still work without it.

yaml
Copy code

---