export default function Page() {
  return (
    <div className="bg-red-200 text-red-500 h-screen flex flex-col justify-center items-center text-4xl font-bold p-10">
      <h1 className="mb-5">Unfortunately this app only works for fuel stations inside Germany, as the data comes from MTS-K, a German federal agency</h1>
      <p>If you are within Germany, try switching your VPN off</p>
    </div>
  )
}
