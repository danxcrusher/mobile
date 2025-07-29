import React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SuiProviders } from '@/components/sui-providers'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SUI Wallet App',
  description: 'A SUI wallet application with testnet support',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Providers>
          <SuiProviders>{children}</SuiProviders>
        </Providers>
        <SuiProviders>
          {children}
        </SuiProviders>
      </body>
    </html>
  )
}
