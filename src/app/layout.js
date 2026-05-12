import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ['latin'],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ['latin'],
});

export const metadata = {
  title: "CodeEye",
  description: "A Unified Platform to monitor and guide your students on programming.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
        <body className="min-h-full flex flex-col">
          <Header />
          {children}
        </body>
    </html>
  );
}
