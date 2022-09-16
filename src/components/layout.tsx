import Link from 'next/link'

interface LayoutProps {
  children: JSX.Element
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col items-center w-8/10 min-h-screen mx-auto bg-gradient-to-r from-rose-400 to-orange-300 pb-20">
      <Header />
      <div className="w-4/5 mx-auto">
        {children}
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex border-gray border-b bg-gradient-to-b from-sky-400 to-sky-200 w-full skey-y-4">
      <div className="p-10">
        <h1 className="font-semibold text-5xl w-max bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          <Link href="/">
            how much
          </Link>
        </h1>
      </div>
    </header>
  )
}
