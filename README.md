# Aura Wellness Spa

Premium full-stack SPA and admin dashboard for a spa, wellness, beauty, salon, therapy, ecommerce, project, and service-based business.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS v4
- GSAP ScrollTrigger and Framer Motion transitions
- Next route handlers for backend APIs
- File-backed CMS store for local development at `data/cms.json`
- MySQL production schema at `database/mysql-schema.sql`

## Run

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`.

## Admin

Open `http://127.0.0.1:3000/admin`.

Default local accounts:

- Admin: `admin@aurawellness.local` / `admin123`
- Manager: `manager@aurawellness.local` / `manager123`
- Staff: `staff@aurawellness.local` / `staff123`

Set `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD`, `MANAGER_PASSWORD`, and `STAFF_PASSWORD` in `.env.local` before production use.

## Dynamic Content

The dashboard manages services, products, bookings, projects, blogs, offers, testimonials, gallery, team, contact leads, ecommerce orders, navigation links, footer links, and homepage settings. Public pages read the same content store, so dashboard edits are reflected across the site.

## Production Database

The local app runs without MySQL by using `data/cms.json`. For production, use `database/mysql-schema.sql` as the relational structure and replace `src/lib/store.ts` with a MySQL-backed repository using the same `CMSData` shape.

## Checks

```bash
npm run lint
npm run build
```
