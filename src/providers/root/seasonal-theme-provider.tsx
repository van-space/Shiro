'use client'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { flushSync } from 'react-dom'

import Lantern from '~/components/seasonal/Lantern'
import Snowfall from '~/components/seasonal/SnowFall'
import { transitionViewIfSupported } from '~/lib/dom'
import { toast } from '~/lib/toast'

export function SeasonalThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme, theme } = useTheme()
  const buildThemeTransition = (theme: 'light' | 'dark' | 'system') => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(theme))
    })
  }
  React.useEffect(() => {
    if (theme === 'dark') return
    toast('新年主题已推送，点我立即体验！', 'info', {
      onClick: () => {
        buildThemeTransition('dark')
      },
    })
  }, [])
  return (
    <>
      <Snowfall maxFlake={10} flakeSize={8} fallSpeed={0.2} />
      <Lantern />
      <div>{children}</div>
    </>
  )
}
