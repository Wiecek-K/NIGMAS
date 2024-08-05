import type { Metadata } from 'next'
import { rowdies } from '@/app/ui/fonts'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${rowdies.className} font-normal`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
