// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/layout/Layout'
import SessionProvider from '@/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Children\'s Boutique',
  description: 'Beautiful children\'s clothing and accessories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  )
}