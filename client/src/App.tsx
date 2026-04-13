import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const App = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="absolute right-[-7rem] top-24 h-80 w-80 rounded-full bg-sky-500/14 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <Card className="w-full max-w-5xl border border-white/10 bg-slate-900/70 shadow-[0_32px_90px_-40px_rgba(14,165,233,0.45)] backdrop-blur-2xl">
          <article>
            <CardHeader className="gap-5 border-b border-white/10 pb-8">
              <header className="space-y-5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
                  Weather Briefing
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                    RFS Weather
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                    A premium weather dashboard shell for fast city search,
                    current conditions, and a clean multi-day forecast
                    experience.
                  </CardDescription>
                </div>
              </header>
            </CardHeader>

            <CardContent className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] md:p-8">
              <div className="space-y-6">
                <section
                  aria-labelledby="search-heading"
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/20"
                >
                  <h2
                    id="search-heading"
                    className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400"
                  >
                    Search
                  </h2>
                  {/* search bar component */}
                  <div className="mt-4 rounded-2xl border border-dashed border-cyan-300/25 bg-slate-950/70 px-4 py-5 text-sm text-slate-400">
                    Search bar component placeholder
                  </div>
                </section>

                <section
                  aria-labelledby="forecast-heading"
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-5 shadow-inner shadow-black/20"
                >
                  <h2
                    id="forecast-heading"
                    className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400"
                  >
                    Forecast
                  </h2>
                  {/* weather display component */}
                  <div className="mt-4 rounded-2xl border border-dashed border-sky-300/25 bg-slate-950/70 px-4 py-12 text-sm text-slate-400">
                    Weather display component placeholder
                  </div>
                </section>
              </div>

              <aside
                aria-labelledby="design-direction-heading"
                className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6"
              >
                <div className="space-y-5">
                  <div>
                    <h2
                      id="design-direction-heading"
                      className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500"
                    >
                      Design Direction
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Deep slate surfaces, cyan atmospheric glow, and a glassy
                      command-panel card layout tuned for a weather product.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Surface
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">
                        Slate 950 base
                      </p>
                    </section>
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Accent
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">Cyan glow</p>
                    </section>
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Layout
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">
                        Centered card
                      </p>
                    </section>
                  </div>
                </div>
              </aside>
            </CardContent>
          </article>
        </Card>
      </div>
    </main>
  )
}

export default App
