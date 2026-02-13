/**
 * App Layout Component
 * ====================
 *
 * Main two-panel layout for the Horn Designer application.
 */

import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return <div className="flex h-full w-full bg-background text-foreground">{children}</div>
}
