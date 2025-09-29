import * as React from 'react'

import Balloons from './balloons'
import Firework from './Firework'

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Balloons />
      <Firework particleCount={50}>{children}</Firework>
    </>
  )
}
