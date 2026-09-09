import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-6 text-white">
      <div className="max-w-2xl text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-green">404</div>
        <h1 className="mt-4 font-heading text-5xl font-semibold tracking-tight">Page not found.</h1>
        <p className="mt-6 text-lg leading-8 text-white/72">
          The content may have moved or the URL may be incorrect.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </div>
    </div>
  )
}
