export const Content: Component = ({ children }) => {
  return (
    <main
      style={{
        backgroundSize: '60%',
      }}
      className="fill-content relative bg-[url(https://i.pinimg.com/1200x/54/fe/d8/54fed8f86ad1f0fd04b7ee7ac0cdc5d6.jpg)] bg-repeat px-4 pt-[4.5rem] dark:bg-none md:px-0"
    >
      {children}
    </main>
  )
}
