'use client'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { flushSync } from 'react-dom'

import Birthday from '~/components/seasonal/birthday'
import NewYear from '~/components/seasonal/new-year'
import { useIsMountedState } from '~/hooks/common/use-is-mounted'
import { transitionViewIfSupported } from '~/lib/dom'
import { toast } from '~/lib/toast'

enum SeasonalTheme {
  None = 'none',
  NewYear = 'new_year',
  Birthday = 'birthday',
}
export function SeasonalThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const seasonalTheme = 'none' as SeasonalTheme
  const { setTheme, resolvedTheme } = useTheme()
  const isMounted = useIsMountedState()

  const buildThemeTransition = (theme: 'light' | 'dark' | 'system') => {
    transitionViewIfSupported(() => {
      flushSync(() => setTheme(theme))
    })
  }
  React.useEffect(() => {
    if (!isMounted) return

    if (resolvedTheme !== 'light') {
      toast('新的主题已推送，点我立即体验！', 'info', {
        onClick: () => {
          buildThemeTransition('light')
        },
      })
    }
  }, [isMounted])

  if (seasonalTheme === SeasonalTheme.None) return <>{children}</>
  return (
    <>
      {seasonalTheme === SeasonalTheme.NewYear ? (
        <NewYear>{children}</NewYear>
      ) : seasonalTheme === SeasonalTheme.Birthday ? (
        <Birthday>{children}</Birthday>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
