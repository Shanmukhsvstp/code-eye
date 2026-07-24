import { Inter, Inter_Tight } from "next/font/google";
import "@/app/globals.css";
import BottomToolBar from "@/components/BottomToolBar/BottomToolBar";
import styles from './rooms_layout.module.css'

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const interTight = Inter_Tight({
    variable: "--font-inter-tight",
    subsets: ["latin"],
});

export const metadata = {
    title: "CodeEye | Ongoing Session",
    description: "Join the CodeEye Room.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${interTight.variable} h-full antialiased`}
        >
            <body className="h-screen w-screen flex flex-col overflow-hidden bg-black text-white m-0 p-0">
                <main className={styles.mainContainer}>
                    {children}
                </main>
                <BottomToolBar className={styles.bottomToolBar} />
            </body>
        </html>
    );
}
