import type React from "react"
import { ReduxProvider } from "@/components/providers/redux-provider"
import AppContent from "./clientLayout"
import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AppContent>{children}</AppContent>
        </ReduxProvider>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata: Metadata = {
  title: "SheNation - Digital Empowerment Platform",
  description:
    "Empowering women through mentorship, skills training, and career opportunities",
  authors: [
    { name: "Ishimwe Sibomana Bienvenu", url: "https://bienvenu.vercel.app/" },
    { name: "Joel MINANI", url: "https://github.com/Miompolly" },
  ],
};