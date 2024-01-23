import type { Metadata } from 'next';
import { inter } from './font';
import './globals.css';


export const metadata: Metadata = {
  title: 'Tic Tac Zone',
  description: 'This applications features different variations of tic-tac-toe game, you can play with AI or play with friends ',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-primary text-secondary pb-6 min-h-screen w-screen`}>{children}</body>
    </html>
  )
}
