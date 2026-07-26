import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

// Load Overleaf web font: Source Sans 3
const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PdfSync - AI Voice & RAG Book Assistant",
  description: "Transform your PDF books into interactive AI conversations. Upload PDFs, ask questions with page citations, and talk with AI.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans3.variable} relative font-sans antialiased`} 
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <Navbar />
          {children}
        </ClerkProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}