import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className="py-4">
        <Header />
        <Tabs />
      </div>

      <main className="mx-auto w-full max-w-[1200px]">{children}</main>
    </div>
  )
}
