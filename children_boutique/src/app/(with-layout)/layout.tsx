// src/app/(with-layout)/layout.tsx
import Layout from '@/components/layout/Layout'

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}