'use client';

import { useEffect, useState } from 'react';
import { getAirdrops } from '@/lib/api';

interface CalendarEvent {
  date: string;
  label: string;
  type: 'deadline' | 'snapshot' | 'tge';
  airdrop: string;
  chain: string;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const totalDays = lastDay.getDate();
  return { startOffset, totalDays };
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const typeColors = {
  deadline: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  snapshot: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  tge: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    getAirdrops().then((airdrops) => {
      const evts: CalendarEvent[] = [];
      for (const a of airdrops) {
        if (a.deadline) evts.push({ date: a.deadline.split('T')[0], label: `⏰ Deadline`, type: 'deadline', airdrop: a.name, chain: a.chain });
        if (a.snapshot_date) evts.push({ date: a.snapshot_date.split('T')[0], label: `📸 Snapshot`, type: 'snapshot', airdrop: a.name, chain: a.chain });
        if (a.tge_date) evts.push({ date: a.tge_date.split('T')[0], label: `🚀 TGE`, type: 'tge', airdrop: a.name, chain: a.chain });
      }
      setEvents(evts);
      setLoading(false);
    });
  }, []);

  const { startOffset, totalDays } = getMonthDays(currentYear, currentMonth);
  const today = formatDate(new Date());

  const eventsForDay = (day: number) => {
    const d = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === d);
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Upcoming events
  const upcoming = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-zinc-500">Loading calendar...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📅 Calendar</h1>
        <p className="text-zinc-500 text-sm">Airdrop deadlines, snapshots & TGE dates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 glass p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg transition-all">←</button>
            <h2 className="text-lg font-semibold">{months[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg transition-all">→</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => (
              <div key={d} className="text-center text-[11px] text-zinc-600 py-1">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsForDay(day);
              const isToday = dateStr === today;

              return (
                <div key={day} className={`aspect-square p-1 rounded-lg text-xs transition-all ${
                  isToday ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5'
                } ${dayEvents.length > 0 ? 'cursor-pointer' : ''}`}>
                  <span className={`text-[11px] ${isToday ? 'text-purple-300 font-bold' : 'text-zinc-500'}`}>{day}</span>
                  <div className="flex gap-0.5 mt-0.5 flex-wrap">
                    {dayEvents.map((e, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${typeColors[e.type].dot}`} title={`${e.airdrop}: ${e.label}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            {[
              { type: 'deadline' as const, label: 'Deadline' },
              { type: 'snapshot' as const, label: 'Snapshot' },
              { type: 'tge' as const, label: 'TGE' },
            ].map(l => (
              <div key={l.type} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${typeColors[l.type].dot}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="glass p-4 md:p-5">
          <h3 className="font-semibold mb-4">📋 Upcoming Events</h3>
          {upcoming.length === 0 ? (
            <p className="text-zinc-600 text-sm">No upcoming events. Add dates to your airdrops!</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((e, i) => {
                const c = typeColors[e.type];
                const daysLeft = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
                return (
                  <div key={i} className={`${c.bg} rounded-xl p-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{e.airdrop}</p>
                        <p className={`text-xs ${c.text}`}>{e.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-zinc-500">{new Date(e.date).toLocaleDateString()}</p>
                        <p className={`text-[11px] ${c.text}`}>{daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
