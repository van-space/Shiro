import * as React from 'react'

import Lantern from '~/components/seasonal/Lantern'
import Snowfall from '~/components/seasonal/SnowFall'

export function SeasonalThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Snowfall maxFlake={10} flakeSize={8} fallSpeed={0.2} />
      <Lantern />
      <div>{children}</div>
    </>
  )
}
