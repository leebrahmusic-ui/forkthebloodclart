import React from "react";

const POSTS = [
    {
        id: "ig-1",
        title: "New Worcester install",
        date: "2 days ago",
        image: "/images/instagram/placeholder-1.jpg",
        href: "https://instagram.com/p/MDGAS001",
    },
    {
        id: "ig-2",
        title: "Leeds & Surrounding service call",
        date: "4 days ago",
        image: "/images/instagram/placeholder-2.jpg",
        href: "https://instagram.com/p/MDGAS002",
    },
    {
        id: "ig-3",
        title: "Magnacleanse day",
        date: "6 days ago",
        image: "/images/instagram/placeholder-3.jpg",
        href: "https://instagram.com/p/MDGAS003",
    },
];

export function InstagramFeed() {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                            Latest on Instagram
                        </p>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                            Recent work across Leeds & Surrounding
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-slate-600">
                            Recent work from Leeds & Surrounding. Live feed will connect soon.
                        </p>
                    </div>
                    <a
                        href="https://instagram.com/mdgasleeds"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                    >
                        View Instagram
                    </a>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {POSTS.map((post) => (
                        <a
                            key={post.id}
                            href={post.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="aspect-[4/3] w-full bg-slate-100">
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${post.image})`,
                                    }}
                                />
                            </div>
                            <div className="p-5">
                                <div className="text-sm font-semibold text-slate-900">
                                    {post.title}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {post.date}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
