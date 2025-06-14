'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AudioForm from '@/components/AudioForm';
import { useEvents } from '@/hooks/useEvents';
import { useGenres } from '@/hooks/useGenres';
import CookieBanner from '@/components/CookieBanner';

export default function CalendarPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_URL;
  const apiLocale = locale === 'el' ? 'el-GR' : locale;
  // Data hooks
  const { events, isLoading: eventsLoading, isError: eventsError } = useEvents(apiLocale);
  const { genres = [], loading: genresLoading, error: genresError } = useGenres();

  // Responsive breakpoint
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persisted view
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('calendarView');
      if (saved === 'list' || saved === 'calendar') return saved;
      return window.innerWidth < 768 ? 'list' : 'calendar';
    }
    return 'calendar';
  });
  useEffect(() => {
    window.localStorage.setItem('calendarView', view);
  }, [view]);

  // Calendar navigation
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());

  // Filters
  const monthOptions = [
    { value: -1, label: t('all') },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: new Date(Date.UTC(2020, i, 1)).toLocaleString(locale, { month: 'long' })
    }))
  ];
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(-1);
  const [selectedGenre, setSelectedGenre] = useState(t('all'));

  // Modal state
  const [selectedEventId, setSelectedEventId] = useState(null);

  // HOVER PREVIEW STATE
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Loading & error
  if (eventsLoading || genresLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }
  if (eventsError || genresError) {
    return (
      <div className="text-center text-red-500 py-32">{t('errorLoadingEvents')}</div>
    );
  }

  // List view data (only future and today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filteredEvents = events
    .filter(evt => {
      const d = new Date(evt.Date);
      d.setHours(0, 0, 0, 0);
      const isFutureOrToday = d >= today;
      const monthMatch = selectedMonthIdx < 0 || d.getMonth() === selectedMonthIdx;
      const genreMatch = selectedGenre === t('all') ||
        (Array.isArray(evt.music_genres) && evt.music_genres.some(g => g.name === selectedGenre));
      return isFutureOrToday && monthMatch && genreMatch;
    })
    .sort((a, b) => new Date(a.Date) - new Date(b.Date));

  const groupedEvents = filteredEvents.reduce((acc, evt) => {
    const d = new Date(evt.Date);
    const key = d.toLocaleDateString(locale, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    (acc[key] = acc[key] || []).push(evt);
    return acc;
  }, {});

  // Calendar view data
  const calendarFiltered = events.filter(evt => {
    const d = new Date(evt.Date);
    const monthOk = d.getFullYear() === calendarYear && d.getMonth() === calendarMonth;
    const genreOk = selectedGenre === t('all') ||
      (Array.isArray(evt.music_genres) && evt.music_genres.some(g => g.name === selectedGenre));
    return monthOk && genreOk;
  });
  const eventsByDay = {};
  calendarFiltered.forEach(evt => {
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

  const goPrev = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else setCalendarMonth(m => m - 1);
  };
  const goNext = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else setCalendarMonth(m => m + 1);
  };

  return (
    <div className="bg-transparent min-h-screen text-white px-6 mt-20 mb-10 text-center">
      <Navbar brandName="dancecalendar" />
      <AudioForm />
      <h1 className="text-6xl py-16 font-bold">{t('title')}</h1>

      {/* View Toggle */}
      {!isMobile && (
        <div className="flex justify-center items-center mb-6 space-x-4">
          <span className={view === 'list' ? 'font-bold' : 'opacity-70'}>{t('listView')}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={view === 'calendar'}
              onChange={() => setView(prev => prev === 'list' ? 'calendar' : 'list')}
            />
            <span className="slider round" />
          </label>
          <span className={view === 'calendar' ? 'font-bold' : 'opacity-70'}>{t('calendarView')}</span>
        </div>
      )}

      {/* List View */}
      {view === 'list' ? (
        <div className="max-w-screen-2xl mx-auto px-6 py-12">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div>
              <label className="block mb-2 uppercase text-sm">{t('filterMonth')}</label>
              <select
                value={selectedMonthIdx}
                onChange={e => setSelectedMonthIdx(Number(e.target.value))}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 uppercase text-sm">{t('filterGenre')}</label>
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {[t('all'), ...genres.map(g => g.name)].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-xl">{t('noEvents')}</div>
          ) : (
            Object.entries(groupedEvents).map(([date, evts]) => (
              <div key={date} className="mb-12">
                <h2 className="text-3xl mb-4 border-b border-gray-700 pb-2">{date}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {evts.map(evt => {
                    const imgPath = evt.Image?.[0]?.formats?.medium?.url || evt.Image?.[0]?.url || '';
                    const imgUrl = imgPath ? `${imgPath}` : '';
                    return (
                      <Link
                        key={evt.id}
                        href={`/events/${evt.slug}`}
                        className="group relative block h-full overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-95"
                        style={{ aspectRatio: '9 / 16' }}
                      >
                        {imgUrl ? (
                          <img src={imgUrl} alt={evt.Title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="bg-gray-700 w-full h-full flex items-center justify-center"></div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-2xl">
                          <h3 className="text-2xl font-bold text-white drop-shadow-lg">{evt.Title}</h3>
                          <p className="text-white text-sm drop-shadow-lg mt-1">
                            {new Date(evt.Date).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}
                            {evt.Time && ` | ${new Date(`1970-01-01T${evt.Time}`).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`}
                          </p>
                          {evt.Desc && (
                            <button
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedEventId(evt.slug); }}
                              className="mt-4 py-2 px-4 bg-black bg-opacity-60 border border-white rounded-2xl uppercase text-xs mx-auto block"
                            >{t('info')}</button>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Calendar View
        <div className="max-w-screen-2xl mx-auto px-6 py-12 text-center">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div>
              <label className="block mb-2 uppercase text-sm">{t('filterMonth')}</label>
              <select
                value={selectedMonthIdx}
                onChange={e => setSelectedMonthIdx(Number(e.target.value))}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 uppercase text-sm">{t('filterGenre')}</label>
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-black border border-gray-700 rounded p-2"
              >
                {[t('all'), ...genres.map(g => g.name)].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            <button onClick={goPrev} className="px-4 py-2 border rounded-full hover:bg-black">&lt;</button>
            <h2 className="text-3xl font-bold">{new Date(calendarYear, calendarMonth).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</h2>
            <button onClick={goNext} className="px-4 py-2 border rounded-full hover:bg-black">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => (
              <div key={i} className="font-bold">{new Date(Date.UTC(2021,0,i+3)).toLocaleDateString(locale,{weekday:'short'})}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2 mt-2 text-center">
              {week.map((day, di) => (
                <div key={di} className="min-h-[150px] border border-gray-700 p-2 relative">
                  {day && (
                    <>
                      <div className="absolute top-2 left-0 right-0 font-bold">{new Date(calendarYear,calendarMonth,day).toLocaleDateString(locale,{day:'numeric'})}</div>
                      <div className="mt-6 space-y-1">
                        {(eventsByDay[day]||[]).map(evt => (
                          <div
                            key={evt.id}
                            className="text-xs p-1 rounded bg-gray-800 cursor-pointer relative"
                            onClick={() => router.push(`/events/${evt.slug}`)}
                            onMouseEnter={e => {
                              setHoveredEvent(evt);
                              setHoverPos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseMove={e => {
                              setHoverPos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseLeave={() => setHoveredEvent(null)}
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
          {/* Hover Preview */}
          {hoveredEvent && hoveredEvent.Image?.[0] && (
            <div
              style={{
                position: 'fixed',
                left: hoverPos.x + 24,
                top: hoverPos.y - 10,
                zIndex: 1000,
                pointerEvents: 'none'
              }}
              className="rounded-xl shadow-2xl border-2 border-gray-700 bg-black bg-opacity-80 transition-all"
            >
              <img
                src={hoveredEvent.Image?.[0]?.formats?.medium?.url || hoveredEvent.Image?.[0]?.url}
                alt={hoveredEvent.Title}
                className="w-full h-full object-cover rounded-xl"
                style={{ display: 'block', maxWidth: '320px', maxHeight: '512px' }}
              />
            </div>
          )}
        </div>
      )}
      <CookieBanner />
      <Footer />
      <style jsx>{`
        .switch { position: relative; display: inline-block; width: 70px; height: 40px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 2px; left: 2px; right: 2px; bottom: 2px; background: #333; transition: 0.4s; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        .slider.round { border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 36px; width: 36px; left: 2px; bottom: 2px; background: #fff; transition: 0.4s; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
        .slider.round:before { border-radius: 50%; }
        input:checked + .slider { background: #222; }
        input:checked + .slider:before { transform: translateX(30px); }
      `}</style>
    </div>
  );
}
