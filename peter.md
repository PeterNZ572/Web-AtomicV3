Created fresh:

src/app/(site)/layout.tsx — minimal layout (GA4 + globalCustomCss from settings)
src/app/(site)/page.tsx — fetches and renders the home page from CMS
src/app/(site)/[slug]/page.tsx — renders any page with metadata
src/app/api/forms/submit/route.ts — form submission handler (hardcoded atomicdigital.co.nz fallback removed)
To get started: copy .env.example to .env, set your DATABASE_URI, and run npm install && npm run migrate && npm run dev.

git submodule add https://github.com/peternz572/AIPreferences.git ai

ssh -L 5433:10.0.1.8:5432 root@108.61.185.48

ssh -N -L 5433:10.0.1.8:5432 root@108.61.185.48 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes
