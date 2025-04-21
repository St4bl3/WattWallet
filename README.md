# ⚡ WattWallet

An **Online Energy MarketPlace** enabling users to buy, sell, and manage energy credits and smart appliances in real time. :contentReference[oaicite:0]{index=0}

[Live Demo](https://wattwallet-jxc1y44o2-st4bl3s-projects.vercel.app)

---

## 📚 Description

WattWallet is a full‑stack Next.js application with end‑to‑end energy trading features: user authentication, wallet management, transaction history, appliance control, product catalog, and sales prediction analytics. It leverages a type‑safe Prisma/MongoDB backend, real‑time charts, and zero‑config Vercel deployment. :contentReference[oaicite:1]{index=1}

---

## 🌟 Key Features

- **User Authentication** via Clerk (Sign up / Sign in)  
- **Wallet & Balance Management** (credits & energy)  
- **Real‑Time Energy Trading** (buy/sell tokens & credits)  
- **Transaction History** with filtering and details  
- **Smart Appliance Control** (on/off & energy usage)  
- **Product Catalog** (energy‑related products & reviews)  
- **Sales Predictions Dashboard** powered by ML models  
- **Interactive Charts** using Chart.js & react‑chartjs‑2  
- **Responsive, Animated UI** with Tailwind CSS & Framer Motion  
- **Secure API Routes** and environment‑based configuration  

---

## 🛠️ Tech Stack

- **Framework:** Next.js (React)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS, PostCSS, class‑variance‑authority  
- **Authentication:** Clerk  
- **ORM & Database:** Prisma with MongoDB :contentReference[oaicite:2]{index=2}  
- **Charts:** Chart.js, react‑chartjs‑2  
- **State & Utils:** Axios, clsx, uuid  
- **Animations & Icons:** Framer Motion, Lucide‑React  
- **Deployment:** Vercel  

---

## 🗂️ Project Structure

```plaintext
wattwallet/
├── prisma/               # Prisma schema & seed scripts
│   ├── schema.prisma
│   └── seed.ts
├── public/               # Static assets (images, icons)
├── src/
│   ├── app/              # Next.js App Router (pages, layouts)
│   ├── components/       # Reusable UI components
│   ├── lib/              # API clients & utilities
│   ├── scripts/          # Helper scripts
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Miscellaneous helpers
├── .eslintrc.json        # ESLint configuration
├── .gitignore
├── LICENSE               # Apache 2.0 License :contentReference[oaicite:3]{index=3}
├── next.config.js        # Next.js configuration
├── package.json          # Scripts & dependencies
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
