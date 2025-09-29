import Lantern from '~/components/seasonal/new-year/Lantern'
import Snowfall from '~/components/seasonal/new-year/SnowFall'

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Snowfall maxFlake={10} flakeSize={8} fallSpeed={0.2} />
      <Lantern />
      <div>{children}</div>
    </>
  )
}
