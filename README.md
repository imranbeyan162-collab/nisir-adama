# Nisir Football Academy — Official Web Application & CMS

> **Adama, Ethiopia • Manafesha Meda**  
> **"A Better Dream for a Better Life"**  
> Prepared & Developed by **Imako Digital Marketing Agency** (`+251 912 251 113` / `+251 921 799 925` / `imranbeyan162@gmail.com`)

---

## 🚀 Overview

This application is built for **Nisir Football Academy** to:
1. Tell the academy's founding story (formed in 2013 E.C. during COVID-19 to protect youth from psychological strain) and build trust with parents.
2. Run a full online multi-child registration and manual payment-verification system (CBE & Telebirr).
3. Provide an editable **Admin Dashboard with Universal Media & Content CMS** allowing Coach Fisha Welde Meskel and staff to upload photos/videos for any page at any time without needing a developer.
4. Showcase Imako Digital Marketing Agency's work to attract future clients.

---

## 🌐 Multilingual Internationalization (i18n)

The site supports three languages:
- **Afaan Oromoo** (`om`)
- **Amharic** (`am` - `አማርኛ` in Ge'ez script)
- **English** (`en`)

On first arrival, visitors choose their preferred language and experience a full-screen cinematic welcome video montage before the homepage loads. Language can also be switched anytime via the top navigation bar.

---

## 📂 Page Architecture & Site Map

- **Language Selector & Splash Intro**: First-visit language selection & welcome video.
- **Home (`/`)**: Hero video/montage, snapshots (200+ players, 4 age categories, 90% academic standard), founding teaser, motto, and registration CTA.
- **About Us (`/about`)**: 2013 E.C. COVID-19 founding story, COVID-era masked training photo archives, Coach challenge interview video, motto, and mission & core values.
- **Why Should You Join Us (`/why-join`)**: Academic & football harmony, coaching quality, Manafesha Meda facilities, student and parent video testimonials.
- **Rules & Regulations (`/rules`)**: Mandatory background disclosure upon joining, age-tiered academic ranking requirements (U10 rank 1-5, U13 rank 1-10, U15/17 rank 1-20, 90% average), and strictly forbidden activities (mobile games, video games, PlayStation, pool/foosball, unauthorized matches).
- **Gallery (`/gallery`)**: Unified photo and video gallery with filter tabs and fullscreen lightbox modal.
- **Coach (`/coach`)**: Profile of Head Coach Fisha Welde Meskel, coaching philosophy, video interview, and direct hotline.
- **Contact Us (`/contact`)**: Hotlines (`+251 911 651 214` & `+251 908 171 773`), TikTok `@nisiradama`, Franco Batu Tower 2nd floor, and inquiry form.
- **Location (`/location`)**: Interactive Google Map pinned to Manafesha Meda, Adama with transport and arrival directions.
- **Registration (`/register`)**: 5-step multi-child registration with dynamic fee calculation (U10/U13: 4000 Birr, U15/17: 5000 Birr), CBE (`1000666650275`) & Telebirr (`0911651214`), proof upload, and printable confirmation slip.
- **Admin Dashboard (`/admin`)**: Password-protected portal (`fisha weldemeskel`) with registration verification queue, Universal Media CMS, Gallery manager, and password settings.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database & ORM**: Prisma ORM with SQLite (`dev.db`), PostgreSQL compatible
- **PDF Generation**: jsPDF registration slip generator
- **Icons**: Lucide React

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Install Dependencies
npm install

# 2. Synchronize & Seed Database
npx prisma db push
node prisma/seed.js

# 3. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔐 Admin Dashboard Credentials
- **URL**: `http://localhost:3000/admin`
- **Default Username**: `coach` or `admin`
- **Default Password**: `fisha weldemeskel`
"# nisir-adama" 
