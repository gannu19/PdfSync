<div align="center">

# 📚 PDF Sync — AI Book Assistant

<p align="center">
  <b>Transform your reading experience with AI voice interaction, smart PDF rendering, and interactive book companions.</b>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Vapi AI](https://img.shields.io/badge/Vapi-Voice_AI-FF4F00?style=for-the-badge)](https://vapi.ai/)
[![Vercel Blob](https://img.shields.io/badge/Vercel-Blob_Storage-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/storage/blob)

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Database Schema](#-database-schema)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🚀 Overview

**PDF Sync** (AI Book Assistant) is a full-stack, AI-powered document reader and voice assistant platform built with Next.js 15, React 19, TypeScript, and MongoDB. It allows users to upload PDF books, store them securely in cloud storage, and interact with their content in real-time through voice or text conversations powered by Vapi AI.

Whether you're listening to audiobook-style summaries, asking questions about specific chapters, or navigating page citations dynamically, PDF Sync bridges the gap between passive reading and interactive learning.

---

## ✨ Key Features

- 🎙️ **Real-Time Voice AI Companion**: Have natural, conversational voice chats with your AI assistant about any uploaded book, powered by Vapi AI.
- ⚡ **Interactive PDF Viewer**: Embedded canvas PDF renderer (`pdfjs-dist`) supporting page jumping, citation linking, text selection, and zoom controls.
- 📚 **Personal Library Management**: Upload, organize, search, and delete books in your personal digital bookshelf.
- 🎭 **Custom AI Personas**: Customize the persona of your AI assistant (e.g., Scholar, Tutor, Storyteller, Analyst) per book.
- 🔒 **Seamless User Authentication**: Full user authentication system powered by Clerk (Sign In, Sign Up, protected routes).
- ☁️ **Fast Cloud Storage**: PDF files and custom book covers are managed using Vercel Blob storage.
- 📊 **Voice Session & Usage Metrics**: Tracks voice session duration, billing periods, and document segment breakdown.
- 🎨 **Modern Responsive UI**: Built with Tailwind CSS v4, Lucide React icons, Base UI / Shadcn primitives, and Sonner notifications.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | React framework with Server Components & Actions |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strongly typed JavaScript |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) | Modern design system & animated components |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, vector icon set |
| **Voice AI** | [Vapi Web SDK](https://vapi.ai/) | Real-time voice agent streaming & conversation |
| **PDF Rendering** | [PDF.js (`pdfjs-dist`)](https://mozilla.github.io/pdf.js/) | Client-side PDF rendering & page extraction |
| **Authentication** | [Clerk Auth](https://clerk.com/) | Identity management & user security |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | NoSQL database for metadata & segment tracking |
| **Cloud Storage** | [Vercel Blob](https://vercel.com/storage/blob) | Edge binary storage for PDF files and cover images |
| **Form Validation**| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Client & server schema validation |

---

## 📁 Architecture & Directory Structure

```
pdf-sync/
├── app/
│   ├── (root)/
│   │   ├── books/
│   │   │   ├── [slug]/          # Book viewer & voice session page
│   │   │   └── new/             # Upload new book page
│   │   ├── page.tsx             # Library dashboard / Hero section
│   │   └── layout.tsx           # Layout wrapper
│   ├── api/
│   │   └── upload/              # File upload API endpoints
│   ├── sign-in/                 # Clerk sign-in page
│   ├── sign-up/                 # Clerk sign-up page
│   ├── globals.css              # Global Tailwind v4 styles
│   └── layout.tsx               # Root application layout
├── components/
│   ├── BookCard.tsx             # Grid item component for books
│   ├── BookDetailsClient.tsx    # Combined viewer & AI control interface
│   ├── BookLibrary.tsx          # Book listing & filter library component
│   ├── HeroSection.tsx          # Landing section with CTA
│   ├── Navbar.tsx               # Header with user profile & navigation
│   ├── PDFViewer.tsx            # Interactive PDF canvas renderer
│   ├── UploadForm.tsx           # Multi-step book upload form
│   ├── VapiControls.tsx         # Voice AI control panel & transcript drawer
│   └── ui/                      # Base Shadcn UI primitives
├── database/
│   ├── models/
│   │   ├── book.model.ts        # Mongoose Book schema
│   │   ├── book-segment.model.ts# Book text segment schema
│   │   └── voice-session.model.ts# Voice session telemetry schema
│   └── mongoose.ts              # MongoDB connection handler
├── hooks/                       # Custom React hooks (e.g. useVapi)
├── lib/
│   ├── actions/
│   │   └── book.actions.ts      # Server actions for book & segment CRUD
│   ├── constants.ts             # Global application constants
│   └── utils.ts                 # Utility helper functions
└── public/                      # Static assets & icons
```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm** / **yarn** / **pnpm** / **bun**
- **MongoDB Atlas Account** (or local MongoDB instance)
- **Clerk Account** (for authentication keys)
- **Vapi AI Account** (for voice assistant integration)
- **Vercel Account** (for Vercel Blob storage token)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gannu19/Fullstack-banking-system.git
   cd "AI Book Assistant/pdf-sync"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

### Environment Variables

Create a `.env.local` file in the `pdf-sync` root directory and populate it with the following configuration:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# MongoDB Database Connection
MONGODB_URI=your_mongodb_connection_string

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_rw_token
PdfSync_STORE_ID=your_store_id

# Vapi Voice AI Integration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_ASSISTANT_ID=your_vapi_assistant_id
```

---

### Running the App

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring **PDF Sync**.

---

## 🗄️ Database Schema

| Schema | Description | Key Fields |
| :--- | :--- | :--- |
| **`Book`** | Metadata for uploaded books | `clerkId`, `title`, `slug`, `author`, `persona`, `fileURL`, `coverURL`, `fileSize`, `totalSegments` |
| **`BookSegment`** | Parsed text chunks & page mapping | `clerkId`, `bookId`, `content`, `segmentIndex`, `pageNumber`, `wordCount` |
| **`VoiceSession`**| Voice call logs and duration tracking | `clerkId`, `bookId`, `startedAt`, `endedAt`, `durationSeconds`, `billingPeriodStart` |

---

## 📜 Available Scripts

In the `pdf-sync` directory, you can run:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production-ready bundle.
- `npm run start`: Runs the built production server.
- `npm run lint`: Runs ESLint checks across the codebase.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [Issues page](https://github.com/gannu19/Fullstack-banking-system/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <br />
  Made with ❤️ by <b>Ganapathi</b>
</div>
