This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Instagram Videos

The home page Instagram reel section is controlled from the admin CRM at `/admin/instagram`. No Instagram environment variables are required.

Paste an Instagram access token in the CRM sync settings, save it, then use "Sync From Instagram" to import video/reel posts into the editable reel list. The token is encrypted with `ADMIN_SESSION_SECRET` before it is saved to local CRM data, and `data/instagram-reels.json` is gitignored so it is not committed.

You can also add each reel manually with its Instagram permalink, caption, sort order, active/draft state, and optional uploaded video, uploaded thumbnail, thumbnail URL, or direct video URL. If a video file or direct MP4/WebM URL is provided, the existing card plays inline without changing the layout. If only the Instagram permalink is provided, the same card size is kept and the button opens the reel on Instagram.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Consultation Lead Emails

The "Book Your Free Design Consultation" forms submit to `/api/consultation`. The server validates the form, rate-limits submissions by IP address, and sends the lead to the admin through Brevo transactional email.

Set these variables locally and in Vercel:

```bash
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=verified-sender@example.com
BREVO_SENDER_NAME="Design Dwellers Studio"
CONSULTATION_ADMIN_EMAIL=admin@example.com
CONSULTATION_ADMIN_NAME="Design Dwellers Admin"
```

`BREVO_SENDER_EMAIL` must be a sender verified in Brevo. The admin email receives the submitted name, phone, email, property type, budget, selected project scope/city, vision, source page, timestamp, and IP address.

## Admin CRM

The portfolio is editable from `/admin`.

Create `.env.local` from `.env.example` and set:

```bash
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=choose-a-long-random-secret
```

Use Vercel Blob only for private CRM JSON and backups: set `BLOB_READ_WRITE_TOKEN` or `CRM_BLOB_READ_WRITE_TOKEN`. Use ImageKit for public website images/videos: set `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and optionally `IMAGEKIT_URL_ENDPOINT`. A custom Vercel variable name such as `test` will be ignored unless its value is copied into one of these names.

After login, you can add/edit projects, categories, cover media, hero media, gallery media, videos, interior project details, SEO fields, and home page Instagram reels. The dashboard also supports project search/filtering, draft previews, delete confirmations, drag/drop media ordering, and portfolio backups. The admin saves editable portfolio data to `data/portfolio.json`; uploaded media is saved under `public/uploads/portfolio` for local development when ImageKit is not configured.

The CRM creates automatic snapshots under `data/backups/portfolio` before saves and deletes, keeping the latest 30 backups. Use `/admin/backups` to restore or delete snapshots.

For production hosting, replace the file-backed storage with a database and cloud media storage before relying on uploads for live client content.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
