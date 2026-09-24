# 📚 Sem 5 Notes

**Live site:** https://sem-5-notes-alpha.vercel.app/

A centralized, mobile-first academic repository built to solve the daily hassle of finding study materials on WhatsApp. Designed with a clean Retro Y2K aesthetic, this platform allows seamless access to all Semester 5 PDFs, PPTs, and notes.

## ✨ Features

- **Retro Y2K Aesthetic**: Bold borders, pastel colors, and a clean neo-brutalist UI.
- **Multi-File Upload Engine**: Admin dashboard to upload multiple PDFs/PPTs instantly.
- **Secure Admin Auth**: Protected upload and manage routes using Supabase Auth and Row Level Security (RLS).
- **Instant Search & Filter**: Client-side filtering to find specific units or topics without page reloads.
- **Direct Downloads**: One-click view or download for all study materials.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend & Auth**: Supabase (PostgreSQL, Storage, RLS)
- **Deployment & Analytics**: Vercel
- **Icons**: Lucide React

## 🚀 Getting Started

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sem-5-notes.git
   cd sem-5-notes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## 💡 Motivation

Built to replace the inefficient workflow of forwarding university notes to personal WhatsApp numbers. Now, classmates like Sujal, Pari, Pratiksha, Shahwaz, and Swayam can directly access organized resources right before the end-sem exams.

---

Made with ❤️ by Suryansh Dev
