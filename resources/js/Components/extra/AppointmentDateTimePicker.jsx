import { useState, useEffect, useMemo, useRef } from "react";
import {
    format,
    addMonths,
    startOfDay,
} from "date-fns";
import { Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const AppointmentDateRangePicker = ({ type, value, onChange }) => {
    // accept string OR { key }
    const serviceKey = useMemo(() => {
        if (!type) return null;
        if (typeof type === "string") return type;
        return type.key || null;
    }, [type]);

    const today = useMemo(() => startOfDay(new Date()), []);
    const maxDate = useMemo(() => addMonths(today, 2), [today]);

    const [date, setDate] = useState(value?.date ? new Date(value.date) : null);
    const [time, setTime] = useState(value?.time || null);

    const [loading, setLoading] = useState(false);
    const [slotsByDay, setSlotsByDay] = useState({});
    const [error, setError] = useState(null);

    // prevent parent prop thrash from overwriting local selection
    const lastAppliedRef = useRef({ date: null, time: null });

    const monthKeys = useMemo(() => {
        const keys = [
            format(today, "yyyy-MM"),
            format(addMonths(today, 1), "yyyy-MM"),
            format(addMonths(today, 2), "yyyy-MM"),
        ];

        return [...new Set(keys)];
    }, [today]);

    const emit = (d, t) => {
        onChange?.({
            date: d ? format(d, "yyyy-MM-dd") : null,
            time: t || null,
        });
    };

    // fetch availability for current + next 2 months
    useEffect(() => {
        if (!serviceKey) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        Promise.all(
            monthKeys.map((month) =>
                axios.get("/appointments/availability", {
                    params: { type: serviceKey, month },
                })
            )
        )
            .then((responses) => {
                if (cancelled) return;

                const merged = {};

                responses.forEach((res) => {
                    const days = res?.data?.data?.days || {};

                    Object.entries(days).forEach(([day, slots]) => {
                        merged[day] = Array.isArray(slots) ? slots : [];
                    });
                });

                setSlotsByDay(merged);
            })
            .catch(() => {
                if (cancelled) return;
                setError("Unable to load availability. Please try again.");
                setSlotsByDay({});
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [serviceKey, monthKeys]);

    const availableDays = useMemo(() => {
        return Object.entries(slotsByDay)
            .filter(([, slots]) => Array.isArray(slots) && slots.length > 0)
            .map(([key]) => {
                const parsed = new Date(`${key}T00:00:00`);
                return {
                    key,
                    date: parsed,
                    label: format(parsed, "EEE d MMM"),
                    sublabel: format(parsed, "MMMM yyyy"),
                };
            })
            .filter(({ date: parsed }) => {
                if (Number.isNaN(parsed.getTime())) return false;
                return parsed >= today && parsed <= maxDate;
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [slotsByDay, today, maxDate]);

    const availableDaySections = useMemo(() => {
        const map = new Map();

        availableDays.forEach((day) => {
            const sectionKey = format(day.date, "yyyy-MM");
            if (!map.has(sectionKey)) {
                map.set(sectionKey, {
                    key: sectionKey,
                    label: format(day.date, "MMMM yyyy"),
                    days: [],
                });
            }

            map.get(sectionKey).days.push(day);
        });

        return Array.from(map.values());
    }, [availableDays]);

    const dayKey = date ? format(date, "yyyy-MM-dd") : null;
    const daySlots = dayKey ? slotsByDay[dayKey] || [] : [];

    // sync from parent safely
    useEffect(() => {
        const incomingDateStr = value?.date || null;
        const incomingTime = value?.time || null;

        const last = lastAppliedRef.current;
        if (incomingDateStr !== last.date || incomingTime !== last.time) {
            lastAppliedRef.current = {
                date: incomingDateStr,
                time: incomingTime,
            };

            const nextDate = incomingDateStr ? new Date(incomingDateStr) : null;
            setDate(nextDate);
            setTime(incomingTime || null);
        }
    }, [value?.date, value?.time]);

    useEffect(() => {
        if (!date && availableDays.length > 0) {
            const firstAvailable = availableDays[0].date;
            setDate(firstAvailable);
            setTime(null);
            emit(firstAvailable, null);
        }
    }, [availableDays, date]);

    useEffect(() => {
        if (!dayKey) return;
        if (availableDays.some((d) => d.key === dayKey)) return;

        setDate(null);
        setTime(null);
        emit(null, null);
    }, [availableDays, dayKey]);

    const selectDate = (d) => {
        if (!d) return;

        setDate(d);
        setTime(null);
        emit(d, null);
    };

    const parseHourFromSlot = (slot) => {
        const raw = String(slot || "").trim();
        if (!raw) return null;

        const match = raw.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (!match) return null;

        let hour = Number(match[1]);
        const ampm = (match[3] || "").toLowerCase();

        if (ampm === "pm" && hour < 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;

        return Number.isFinite(hour) ? hour : null;
    };

    const groupedDaySlots = useMemo(() => {
        const groups = {
            morning: [],
            afternoon: [],
            evening: [],
        };

        daySlots.forEach((slot) => {
            const hour = parseHourFromSlot(slot);

            if (hour === null) {
                groups.afternoon.push(slot);
                return;
            }

            if (hour < 12) groups.morning.push(slot);
            else if (hour < 17) groups.afternoon.push(slot);
            else groups.evening.push(slot);
        });

        return groups;
    }, [daySlots]);

    const slotSections = [
        {
            key: "morning",
            title: "Morning",
            subtitle: "Before 12:00",
            slots: groupedDaySlots.morning,
        },
        {
            key: "afternoon",
            title: "Afternoon",
            subtitle: "12:00 – 17:00",
            slots: groupedDaySlots.afternoon,
        },
        {
            key: "evening",
            title: "Evening",
            subtitle: "After 17:00",
            slots: groupedDaySlots.evening,
        },
    ];

    const selectTime = (t) => {
        if (!date) return;
        setTime(t);
        emit(date, t);
    };


    return (
        <div className="w-full max-w-6xl rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-slate-200">
                <div>
                    <div className="text-base font-semibold text-slate-900 line-clamp-1">
                        Select a date and time
                    </div>
                    <div className="text-sm text-slate-600 line-clamp-1">
                            Pick your preferred day, then choose a time window.
                    </div>
                </div>

                {serviceKey ? (
                    <span className="inline-flex items-center rounded-full border text-center border-slate-200 bg-slate-50 px-3 py-1 text-[10px] lg:text-xs font-medium text-slate-700 whitespace-nowrap">
                        {String(serviceKey).replaceAll("_", " ").toUpperCase()}
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                        Select service type first
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch h-full">
                {/* Left: Date list */}
                <div className="border-b lg:border-b-0 lg:border-r border-slate-200 p-5 sm:p-6">
                    <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                        <div
                            className={cn(
                                "rounded-lg border px-3 py-2",
                                date
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-slate-50 text-slate-600"
                            )}
                        >
                            <p className="font-semibold">1) Choose a day</p>
                        </div>
                        <div
                            className={cn(
                                "rounded-lg border px-3 py-2",
                                time
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-slate-50 text-slate-600"
                            )}
                        >
                            <p className="font-semibold">2) Choose a time</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="h-4 w-4 text-slate-700" />
                        <div className="text-sm font-semibold text-slate-900">
                            Available dates
                        </div>
                        <div className="text-xs text-slate-500">
                            Next 2 months
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-10 rounded-lg bg-slate-100" />
                                <div className="h-10 rounded-lg bg-slate-100" />
                                <div className="h-10 rounded-lg bg-slate-100" />
                            </div>
                        ) : error ? (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                                {error}
                            </div>
                        ) : availableDays.length === 0 ? (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                No dates available right now. Please try again shortly.
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                                    {availableDaySections.map((section) => (
                                        <div key={section.key}>
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                                                {section.label}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {section.days.map((d, idx) => {
                                                    const active = dayKey === d.key;
                                                    const isEarliest = d.key === availableDays[0]?.key;

                                                    return (
                                                        <button
                                                            key={d.key}
                                                            type="button"
                                                            onClick={() => selectDate(d.date)}
                                                            className={cn(
                                                                "w-full min-w-0 rounded-lg border px-3 py-2 text-left transition-all",
                                                                active
                                                                    ? "border-blue-600 bg-blue-50"
                                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                            )}
                                                            aria-pressed={active}
                                                        >
                                                            {isEarliest && idx === 0 && (
                                                                <span className="mb-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                                                    Earliest
                                                                </span>
                                                            )}
                                                            <p className="text-sm font-semibold text-slate-900 leading-tight whitespace-normal break-words">
                                                                {d.label}
                                                            </p>
                                                            <p className="text-xs text-slate-500 leading-tight whitespace-normal">
                                                                {format(d.date, "EEEE")}
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Fixed summary */}
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        {date && time ? (
                            <div className="text-sm text-slate-800">
                                Your chosen appointment:{" "}
                                <span className="font-semibold text-slate-900">
                                    {format(date, "EEEE do MMMM")}
                                </span>{" "}
                                at{" "}
                                <span className="font-semibold text-slate-900">
                                    {time}
                                </span>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-700">
                                Please select a date and time to continue.
                            </div>
                        )}
                    </div>

                    {/* <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            You can book from{" "}
            <span className="font-semibold">{format(today, "d MMM yyyy")}</span>{" "}
            up to{" "}
            <span className="font-semibold">
              {format(maxDate, "d MMM yyyy")}
            </span>
            .
          </div> */}
                </div>

                {/* Right: Time slots */}
                <div className="p-5 sm:p-6 flex flex-col max-h-[510px] overflow-y-auto">
                    {/* Fixed header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-700" />
                            <div className="text-sm font-semibold text-slate-900">
                                Available times
                            </div>
                        </div>

                        {date ? (
                            <div className="text-xs text-slate-600">
                                {format(date, "EEEE, d MMM yyyy")}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-500">
                                No date selected
                            </div>
                        )}
                    </div>

                    {/* Scrollable middle */}
                    <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                        {!serviceKey ? (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="text-sm font-medium text-slate-900">
                                    Service type required
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Select a service type to load availability.
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-44 bg-slate-100 rounded" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="h-12 bg-slate-100 rounded-lg" />
                                    <div className="h-12 bg-slate-100 rounded-lg" />
                                    <div className="h-12 bg-slate-100 rounded-lg" />
                                    <div className="h-12 bg-slate-100 rounded-lg" />
                                </div>
                                <div className="text-xs text-slate-500">
                                    Loading availability…
                                </div>
                            </div>
                        ) : error ? (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                                <div className="text-sm font-medium text-rose-900">
                                    Something went wrong
                                </div>
                                <div className="text-sm text-rose-800 mt-1">
                                    {error}
                                </div>
                            </div>
                        ) : !date ? (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="text-sm font-medium text-slate-900">
                                    Select a date
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Choose a date to see available time slots.
                                </div>
                            </div>
                        ) : daySlots.length === 0 ? (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="text-sm font-medium text-slate-900">
                                    No slots available
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Try another day to find an open slot.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {slotSections.map((section) => {
                                    if (!section.slots.length) return null;

                                    return (
                                        <div
                                            key={section.key}
                                            className="rounded-lg border border-slate-200 bg-white p-3"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {section.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {section.subtitle}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {section.slots.map((t) => {
                                                    const active = time === t;

                                                    return (
                                                        <button
                                                            key={`${section.key}-${t}`}
                                                            type="button"
                                                            onClick={() => selectTime(t)}
                                                            aria-pressed={active}
                                                            className={cn(
                                                                "rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
                                                                active
                                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDateRangePicker;
