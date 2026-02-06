import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in!
                            </div>
                        </div>

                        <div className="overflow-hidden bg-emerald-600 text-white shadow-sm sm:rounded-lg">
                            <div className="p-6 flex flex-col gap-3">
                                <div className="text-sm uppercase tracking-wide text-emerald-100">
                                    Scheduling
                                </div>
                                <div className="text-xl font-semibold">
                                    Control slots, gaps, cutoffs, and blackouts.
                                </div>
                                <div className="text-emerald-50 text-sm">
                                    Manage availability rules and mark blackout days.
                                </div>
                                <div>
                                    <a
                                        href={route('admin.scheduling.index')}
                                        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50"
                                    >
                                        Open Scheduling
                                        <span aria-hidden>→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
