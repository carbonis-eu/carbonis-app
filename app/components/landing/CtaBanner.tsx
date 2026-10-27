import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaBanner() {
  return (
    <section id="demo" className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-navy px-8 py-14 sm:px-14 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-cobalt/40 blur-3xl"
          />
          <div className="relative max-w-xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Get CBAM-ready before your first annual declaration.
            </h2>
            <p className="mt-4 text-lg text-blue-100/80">
              Start a free 30-day trial. No credit card required.
            </p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cobalt px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4fe6]"
            >
              Start free trial
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
