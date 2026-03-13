# Jab — Boxing Workouts & Timer

Free combat sports training app with guided combo callouts, a professional round timer, and deep gamification. No account, no ads, no paywall.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **UI:** React 19, Tailwind CSS v4
- **Native:** Capacitor (iOS)
- **Hosting:** GitHub Pages
- **Domain:** getjab.app

## Development

```bash
npm install
npx next dev --turbopack
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build        # Static export to out/
npx cap sync ios     # Sync to iOS project
npx cap open ios     # Open in Xcode
```

## Project Structure

```
src/
  app/           # Next.js pages (home, timer, workouts, progress)
  components/    # React components
  hooks/         # Custom hooks (useTimer, useProgress, useGamification, etc.)
  lib/           # Utilities (storage, types, haptics, shareCard, etc.)
  data/          # Workout definitions
public/          # Static assets, service worker, manifest
ios/             # Capacitor iOS project
docs/            # Personal reference docs (not deployed)
```
