# LIVEON CONNECT — Event AV Rental Website

Official production website for **LIVEON CONNECT** (*LED WALL, LIVE STREAMING, SOUND COMPANY*), based in Manimala, Kottayam, Kerala – 686543, India.

Built with **React 19**, **TypeScript**, **Vite**, **React Router**, and **Tailwind CSS**.

---

## Key Features

- **Official Brand Asset Integration**: Uses the official LIVEON CONNECT logo (`/images/liveon-connect-logo.png`, with the original reference retained at `/images/liveon-connect-logo-original.png`).
- **Centralized Business Configuration**: All contact numbers, WhatsApp settings, address, Instagram URL, and SEO metadata live in `src/config/site.ts`.
- **Complete 52-Product Rental Catalogue (`src/data/products.ts`)**:
  - **Sound Systems**: 11 products
  - **Lighting**: 11 products
  - **LED Walls**: 5 products (including square-foot width × height calculator for the P2 LED Wall)
  - **TVs & Displays**: 7 products
  - **Projectors**: 2 products
  - **Mixers & Mics**: 3 products
  - **AV Accessories**: 6 products
  - **Special Effects**: 6 products
  - **Genset**: 1 product (DEC DE63 CPCB IV+ billed per 5-hour operational block)
- **Editable Reference Rates**: Customize indicative reference rates or mark items as *"Request a Quote"* directly from the UI or in `src/data/products.ts`.
- **Multi-Product Quote Builder & WhatsApp Click-to-Chat**: Synchronized quote cart persisted in `localStorage` with instant URL-encoded WhatsApp quotation generation to `+91 8590952476`.

---

## Step-by-Step Guide: Local Setup & Vercel Deployment

### 1. Exporting the Project from Google AI Studio
Click the **Download / Export** option in Google AI Studio (or sync directly to GitHub) to download the complete project archive to your computer.

### 2. Saving All Source Files and Assets
Extract the project zip into a local folder (for example, `liveon-connect-av-rentals`). Confirm that the following directories and files are present:
- `public/images/liveon-connect-logo.png` (official cleaned transparent logo)
- `public/images/products/*.svg` (52 local equipment visuals)
- `src/config/site.ts`
- `src/data/products.ts`
- `vercel.json`
- `package.json` & `package-lock.json`

### 3. Installing the Required Node.js LTS Version
Install **Node.js 20 LTS** (or Node.js 22 LTS) from [nodejs.org](https://nodejs.org/). Verify your installation:
```bash
node -v
npm -v
```

### 4. Installing Dependencies
From the project root directory, install all required packages:
```bash
npm install
```

### 5. Running the Local Development Server
Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to inspect the website.

### 6. Testing Type Checking and the Production Build
Verify there are zero TypeScript errors and build the production bundle:
```bash
npm run typecheck
npm run build
npm run preview
```
This compiles the production static output into the `dist/` directory.

### 7. Uploading the Project to GitHub
Initialize a Git repository and push the project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: LIVEON CONNECT AV rental website"
git branch -M main
git remote add origin https://github.com/<your-username>/liveon-connect.git
git push -u origin main
```

### 8. Importing the Repository into Vercel
1. Log in to [vercel.com](https://vercel.com/) and click **Add New... → Project**.
2. Select your `liveon-connect` GitHub repository and click **Import**.

### 9. Selecting the Correct Framework Preset
Ensure Vercel detects **Framework Preset: Vite**.

### 10. Configuring Build Commands and Output Directory
Use these exact build settings in Vercel:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

*(Note: `vercel.json` is already included in the root to rewrite client-side routes like `/catalogue`, `/quote`, `/about`, and `/contact` to `/index.html` so page refreshes never return a 404.)*

### 11. Adding Environment Variables (Optional Overrides)
In the Vercel project configuration under **Environment Variables**, you can optionally add overrides matching `.env.example`:
- `VITE_SITE_URL` = `https://your-domain.com`
- `VITE_WHATSAPP_NUMBER` = `918590952476`
- `VITE_CONTACT_EMAIL` = `Liveonconnect@gmail.com`
- `VITE_BUSINESS_PHONE` = `+91 8590952476`

*(The website works out of the box with the official defaults in `src/config/site.ts` even if no environment variables are set.)*

### 12. Deploying the Website
Click **Deploy**. Vercel will install dependencies, run `vite build`, and publish the production deployment.

### 13. Testing the Live URL
Once deployed, open your `.vercel.app` URL and test:
- Direct navigation and browser refresh on `/catalogue`, `/quote`, `/about`, and `/contact`.
- Adding products to the Quote Builder and clicking **Send Quote Request via WhatsApp**.

### 14. Connecting a Custom Domain
In your Vercel Project Dashboard, go to **Settings → Domains**, enter your custom domain (e.g., `liveonconnect.in` or `liveonconnect.com`), and configure the DNS records provided by Vercel at your domain registrar.
