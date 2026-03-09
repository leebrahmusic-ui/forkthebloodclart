export default function NewBoilerQuoteCta() {
    return (
        <section className="mt-10 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 ring-1 ring-white/20">
                        FAST QUOTE
                    </p>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Get a new boiler quote in 60 secs from £1395 (24kw)
                    </h2>
                    <p className="mt-2 text-blue-100">
                        Instant online price, no pressure, and clear options.
                    </p>
                </div>

                <a
                    href="/book/quote/new"
                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-700"
                >
                    Get New Boiler Quote
                </a>
            </div>
        </section>
    );
}
