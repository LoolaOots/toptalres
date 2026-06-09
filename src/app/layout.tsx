import type { Metadata } from 'next'
import ThemeRegistry from '@/providers/ThemeRegistry'
import QueryProvider from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Restaurant Review',
  description: 'Discover and review restaurants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
