# Events Platform Frontend

Next.js + Tailwind web app for browsing events, viewing details, and signing up.

## Features
- Public event listing and detail pages.
- Add to Google Calendar link.
- Signup form.
- Admin event creation (passcode protected).
- Optional Stripe “pay what you feel” checkout.

## Requirements
- Node 20+
- Netlify account (for deploy)

## Environment
Create `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
```

For deploy, set:

```
NEXT_PUBLIC_API_BASE_URL=https://<backend>.onrender.com
```

## Development
```bash
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Build
```bash
npm run build
npm start
```

## Pages
- `/` → List of events  
- `/events/[id]` → Event detail + signup + calendar link  
- `/admin` → Create new event  
- `/thanks` → Payment / signup confirmation  

## Deployment
- Push to GitHub.  
- Connect repo to Netlify.  
- Add `NEXT_PUBLIC_API_BASE_URL` in Netlify site settings.  
