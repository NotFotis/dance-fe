// app/calendar/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AudioForm from '@/components/AudioForm';
import EventDetailsModal from '@/components/modals/EventDetailsModal';
import { useTranslations } from 'next-intl';
import { useEvents } from '@/hooks/useEvents';
import { useGenres } from '@/hooks/useGenres';

export default function CalendarPage() {
  const t = useTranslations();
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_URL;

  // ─── 1. Hooks all at top ─────────────────────────────────────────────────────
  // data hooks
  const {
    events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useEvents();
  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useGenres();

  // responsive view
  const [isMobile, setIsMobile] = useState(false);

  // list/calendar toggle
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedGenre, setSelectedGenre] = useState(t('all'));
  const [view, setView] = useState('calendar');

  // calendar navigation
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());

  // modal
  const [selectedEventId, setSelectedEventId] = useState(null);

  // ─── 2. Effects ─────────────────────────────────────────────────────────────
  // track resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // set initial view based on isMobile
  useEffect(() => {
    setView(isMobile ? 'list' : 'calendar');
  }, [isMobile]);

  // ─── 3. Early returns ───────────────────────────────────────────────────────
  if (eventsLoading || genresLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }
  if (eventsError) {
    return (
      <div className="text-center text-red-500 py-32">
        {t('errorLoadingEvents')}
      </div>
    );
  }

  // ─── 4. Derived data ────────────────────────────────────────────────────────
  const months = [
    t('all'),
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ];

  // list view filtering & grouping
  const filteredEvents = events.filter((evt) => {
    const monthName = new Date(evt.Date).toLocaleString('default', { month: 'long' });
    const monthMatch = selectedMonth === t('all') || monthName === selectedMonth;
    const genreMatch =
      selectedGenre === t('all') ||
      (Array.isArray(evt.music_genres) &&
        evt.music_genres.some((g) => g.name === selectedGenre));
    return monthMatch && genreMatch;
  });
  const groupedEvents = filteredEvents.reduce((acc, evt) => {
    const key = new Date(evt.Date).toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    (acc[key] = acc[key] || []).push(evt);
    return acc;
  }, {});

  // calendar view filtering & grouping
  const calendarFiltered = events.filter((evt) => {
    const d = new Date(evt.Date);
    const monthOk = d.getFullYear() === calendarYear && d.getMonth() === calendarMonth;
    const genreOk =
      selectedGenre === t('all') ||
      (Array.isArray(evt.music_genres) &&
        evt.music_genres.some((g) => g.name === selectedGenre));
    return monthOk && genreOk;
  });
  const eventsByDay = {};
  calendarFiltered.forEach((evt) => {
    const day = new Date(evt.Date).getDate();
    (eventsByDay[day] = eventsByDay[day] || []).push(evt);
  });
  const generateCalendarGrid = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells = Array(firstDay).fill(null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, i) =>
      cells.slice(i * 7, i * 7 + 7)
    );
  };
  const weeks = generateCalendarGrid();

  // calendar navigation handlers
  const goPrev = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // ─── 5. Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-transparent min-h-screen text-white px-6 mt-20 mb-20">
      <Navbar brandName="dancecalendar" />
      <AudioForm />

      <h1 className="text-6xl text-center py-16 font-bold">{t('title')}</h1>

      {/* desktop view toggle */}
      {!isMobile && (
        <div className="flex justify-center items-center mb-8 space-x-4">
          <span className={view === 'list' ? 'font-bold' : 'opacity-70'}>
            {t('listView')}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={view === 'calendar'}
              onChange={() =>
                setView((v) => (v === 'list' ? 'calendar' : 'list'))
              }
            />
            <span className="slider round" />
          </label>
          <span className={view === 'calendar' ? 'font-bold' : 'opacity-70'}>
            {t('calendarView')}
          </span>
        </div>
      )}

      {view === 'list' ? (
        <div className="max-w-7xl mx-auto py-12">
          {/* filters */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div>
              <label className="block mb-2 uppercase text-sm">
                {t('filterMonth')}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 uppercase text-sm">
                {t('filterGenre')}
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {[t('all'), ...genres.map((g) => g.name)].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center text-xl">{t('noEvents')}</div>
          ) : (
            Object.entries(groupedEvents).map(([date, evts]) => (
              <div key={date} className="mb-12">
                <h2 className="text-3xl mb-4 border-b border-gray-700 pb-2">
                  {date}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {evts.map((evt) => {
                    const img = evt.Image?.[0]?.formats?.medium?.url ||
                                evt.Image?.[0]?.url ||
                                '';
                    return (
                      <div
                        key={evt.id}
                        className="rounded-xl overflow-hidden shadow-lg cursor-pointer"
                        onClick={() =>
                          router.push(`/events/${evt.documentId}`)
                        }
                      >
                        {img && (
                          <img
                            src={`${URL}${img}`}
                            alt={evt.Title}
                            className="w-full h-56 object-cover"
                          />
                        )}
                        <div className="p-4 bg-black bg-opacity-60">
                          <h3 className="text-2xl font-bold">{evt.Title}</h3>
                          <p className="text-xs mt-1">
                            {t('time')}: {evt.Time.split('.')[0]}
                          </p>
                          <p className="text-xs">
                            {t('location')}: {evt.Location || t('noLocation')}
                          </p>
                          {evt.Desc && (
                            <button
                              className="mt-4 py-2 px-4 border border-white rounded uppercase text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventId(evt.documentId);
                              }}
                            >
                              {t('info')}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-12">
          {/* calendar header */}
          <div className="flex justify-between items-center mb-8">
            <button onClick={goPrev} className="px-4 py-2 border rounded-full hover:bg-black">
              &lt;
            </button>
            <h2 className="text-3xl font-bold">
              {new Date(calendarYear, calendarMonth).toLocaleString(
                'default',
                { month: 'long', year: 'numeric' }
              )}
            </h2>
            <button onClick={goNext} className="px-4 py-2 border rounded-full hover:bg-black">
              &gt;
            </button>
          </div>
          {/* calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center font-bold">
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2 mt-2">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="min-h-[150px] border border-gray-700 p-2 relative"
                >
                  {day && (
                    <>
                      <div className="absolute top-2 left-2 font-bold">
                        {day}
                      </div>
                      <div className="mt-6 space-y-1">
                        {(eventsByDay[day] || []).map((evt) => (
                          <div
                            key={evt.id}
                            className="text-xs p-1 rounded bg-gray-800 cursor-pointer"
                            onClick={() =>
                              router.push(`/events/${evt.documentId}`)
                            }
                          >
                            {evt.Title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}


      <Footer />

      {/* switch CSS omitted for brevity */}
          <style jsx>{`
      .switch {
        position: relative;
        display: inline-block;
        width: 70px;
        height: 40px;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      /* the track */
      .slider {
        position: absolute;
        cursor: pointer;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        background: #333;
        transition: 0.4s;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
      /* make it pill-shaped */
      .slider.round {
        border-radius: 20px;
      }
      /* the knob */
      .slider:before {
        position: absolute;
        content: "";
        height: 36px;
        width: 36px;
        left: 2px;
        bottom: 2px;
        background: #fff;
        transition: 0.4s;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      }
      /* knob round */
      .slider.round:before {
        border-radius: 50%;
      }
      /* checked states */
      input:checked + .slider {
        background: #222;
      }
      input:checked + .slider:before {
        transform: translateX(30px);
      }
    `}</style>
    </div>
  );
}
