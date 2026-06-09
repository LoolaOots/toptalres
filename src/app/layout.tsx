import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import ThemeRegistry from '@/providers/ThemeRegistry'
import QueryProvider from '@/providers/QueryProvider'

// Montserrat is used as a stand-in for Proxima Nova (same weight/proportions).
// To use the real Proxima Nova, place font files in public/fonts/ and switch
// to next/font/local pointing to those files.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-proxima-nova',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Restaurant Review',
  description: 'Discover and review restaurants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body style={{ fontFamily: 'var(--font-proxima-nova), Montserrat, sans-serif', margin: 0 }}>
        <ThemeRegistry>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
