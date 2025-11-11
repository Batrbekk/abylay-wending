# Азат & Әсем Wedding Website

A beautiful, modern wedding invitation website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Turbopack** - Fast build tool

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or http://localhost:3001 if port 3000 is in use) to view the website.

## 🏗️ Project Structure

```
abyl-wedding/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with wedding info
│   ├── globals.css         # Global styles with Tailwind
│   └── favicon.ico         # Favicon
├── components/
│   ├── ui/                 # Reusable UI components
│   └── sections/           # Page sections
├── lib/
│   └── utils.ts            # Utility functions & animations
├── public/
│   ├── images/             # Static images
│   └── audio/              # Audio files
└── package.json
```

## 🎨 Features

- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎯 Modern UI with Tailwind CSS
- ⚡ Fast performance with Turbopack
- 💍 Wedding-themed design
- 🌙 Dark mode support

## 🎭 Animation Variants

Available animation variants in `lib/utils.ts`:

- `fadeIn` - Fade in with subtle slide up
- `fadeInUp` - Fade in with larger slide up effect
- `staggerContainer` - Stagger children animations
- `scaleIn` - Scale and fade in effect

## 📝 Customization

### Update Wedding Information

Edit `app/page.tsx` to change:
- Names
- Dates
- Location
- Text content

### Modify Colors

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --background: #faf9f6;    /* Main background */
  --foreground: #2c2c2c;    /* Text color */
  --primary: #d4a574;       /* Primary accent (gold) */
  --secondary: #8b7355;     /* Secondary accent (brown) */
  --accent: #f5e6d3;        /* Accent background (cream) */
}
```

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📄 License

This project is created for Азат & Әсем's wedding celebration.

---

Made with ❤️ using Next.js
