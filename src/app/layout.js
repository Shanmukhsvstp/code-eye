import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import TopLoader from "@/components/TopLoader";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = {
  title: "CodeEye",
  description: "A unified platform to understand and explain programming in a better way for universities.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TopLoader />
        <AuthProvider>
          <Suspense>
            <TopNav />
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
