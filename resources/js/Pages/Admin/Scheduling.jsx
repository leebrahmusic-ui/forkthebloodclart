import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Scheduling({ settings = [], blackouts = [], services = {} }) {
    const { flash } = usePage().props;
    const [tab, setTab] = useState('rules');

    const { data, setData, post, processing } = useForm({
        settings,
    });

    const { data: blackoutData, setData: setBlackoutData, post: postBlackout, processing: blackoutProcessing, reset: resetBlackout } = useForm({
        service_key: '',
        date: '',
        start_time: '',
        end_time: '',
        reason: '',
    });

    const onSaveSettings = () => {
        post(route('admin.scheduling.settings'));
    };

    const onAddBlackout = () => {
        postBlackout(route('admin.scheduling.blackouts.add'), {
            onSuccess: () => resetBlackout(),
        });
    };

    const onDeleteBlackout = (id) => {
        router.delete(route('admin.scheduling.blackouts.delete', id));
    };

    const serviceOptions = Object.entries(services);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Scheduling</h2>}
        >
            <Head title="Scheduling" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="mb-4 space-y-3">
                        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                            {['rules', 'blackouts'].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md ${tab === key ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'}`}
                                >
                                    {key === 'rules' ? 'Rules' : 'Blackouts'}
                                </button>
                            ))}
                        </div>
                        {flash?.success && (
                            <p className="text-sm text-emerald-700">{flash.success}</p>
                        )}
                        {tab === 'rules' && (
                            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
                                <p className="font-semibold">How to set availability</p>
                                <ul className="mt-2 list-disc space-y-1 pl-4 text-emerald-900">
                                    <li>Set slot length and your working hours; that creates the day’s slots.</li>
                                    <li>Installs automatically block the whole day. Other services only block their chosen slot.</li>
                                    <li>Use “Max per day” to cap how many of that service you take.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {tab === 'rules' && (
                        <div className="space-y-4">
                            {data.settings.map((item, idx) => (
                                <div key={item.service_key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{item.service_label}</p>
                                            <p className="text-xs text-gray-500">Service key: {item.service_key}</p>
                                        </div>
                                        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Simple: set slot length & hours</div>
                                    </div>

                                    <div className="mt-3 text-xs text-gray-600">
                                        Slots every <strong>{item.slot_minutes || 60} mins</strong> between <strong>{item.start_hour}:00</strong> and <strong>{item.end_hour}:00</strong>. Max <strong>{item.max_per_day || 0}</strong> per day.
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <Field label="Slot length">
                                            <select
                                                value={item.slot_minutes}
                                                onChange={(e) => updateSetting(idx, 'slot_minutes', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            >
                                                {[30,45,60,75,90,120].map((m) => (
                                                    <option key={m} value={m}>{m} minutes</option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Day starts">
                                            <input
                                                type="number"
                                                min="0"
                                                max="23"
                                                value={item.start_hour}
                                                onChange={(e) => updateSetting(idx, 'start_hour', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            />
                                        </Field>
                                        <Field label="Day ends">
                                            <input
                                                type="number"
                                                min="1"
                                                max="24"
                                                value={item.end_hour}
                                                onChange={(e) => updateSetting(idx, 'end_hour', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            />
                                        </Field>
                                        <Field label="Last slot starts (optional)">
                                            <input
                                                type="time"
                                                value={item.last_slot_time || ''}
                                                onChange={(e) => updateSetting(idx, 'last_slot_time', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            />
                                        </Field>
                                        <Field label="Max per day">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.max_per_day}
                                                onChange={(e) => updateSetting(idx, 'max_per_day', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            />
                                        </Field>
                                        <Field label="Buffer (advanced)">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.gap_minutes}
                                                onChange={(e) => updateSetting(idx, 'gap_minutes', e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            />
                                            <p className="mt-1 text-[11px] text-gray-500">Leave at 0 unless you need extra prep/cleanup.</p>
                                        </Field>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <button
                                    onClick={onSaveSettings}
                                    disabled={processing}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {processing ? 'Saving…' : 'Save settings'}
                                </button>
                            </div>
                        </div>
                    )}

                    {tab === 'blackouts' && (
                        <div className="space-y-6">
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <Field label="Service">
                                        <select
                                            value={blackoutData.service_key}
                                            onChange={(e) => setBlackoutData('service_key', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                        >
                                            <option value="">All services</option>
                                            {serviceOptions.map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Date">
                                        <input
                                            type="date"
                                            value={blackoutData.date}
                                            onChange={(e) => setBlackoutData('date', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                        />
                                    </Field>
                                    <Field label="Reason (optional)">
                                        <input
                                            type="text"
                                            value={blackoutData.reason}
                                            onChange={(e) => setBlackoutData('reason', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                            placeholder="Day off, training, emergency"
                                        />
                                    </Field>
                                    <Field label="Start time (optional)">
                                        <input
                                            type="time"
                                            value={blackoutData.start_time}
                                            onChange={(e) => setBlackoutData('start_time', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                        />
                                    </Field>
                                    <Field label="End time (optional)">
                                        <input
                                            type="time"
                                            value={blackoutData.end_time}
                                            onChange={(e) => setBlackoutData('end_time', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2"
                                        />
                                    </Field>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={onAddBlackout}
                                        disabled={blackoutProcessing}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        {blackoutProcessing ? 'Adding…' : 'Add blackout'}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Upcoming blackouts</h3>
                                {blackouts.length === 0 && (
                                    <p className="text-sm text-gray-500">No blackouts set.</p>
                                )}
                                <div className="space-y-3">
                                    {blackouts.map((b) => (
                                        <div key={b.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-gray-900">{b.reason || 'Blackout'}</p>
                                                <p className="text-gray-600 text-xs">
                                                    {b.service_key ? services[b.service_key] || b.service_key : 'All services'} • {new Date(b.starts_at).toLocaleString()} — {new Date(b.ends_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => onDeleteBlackout(b.id)}
                                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );

    function updateSetting(index, key, value) {
        setData('settings', data.settings.map((row, i) => i === index ? { ...row, [key]: value } : row));
    }
}

function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1 text-xs font-semibold text-gray-600">
            <span>{label}</span>
            {children}
        </label>
    );
}
