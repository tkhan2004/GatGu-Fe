import { useState, useEffect } from 'react';
import apiService from '../../services/api';
import Card from '../ui/Card';

export default function CalendarStats() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDays, setActiveDays] = useState([]);
    const [loading, setLoading] = useState(false);

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    useEffect(() => {
        fetchCalendarData();
    }, [month, year]);

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            const data = await apiService.getCalendarCheckin(month, year);
            setActiveDays(data.active_days || []);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const getDaysInMonth = (m, y) => {
        return new Date(y, m, 0).getDate();
    };

    const getFirstDayOfMonth = (m, y) => {
        return new Date(y, m - 1, 1).getDay();
    };

    const isActiveDay = (day) => {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return activeDays.some(d => d.startsWith(dateStr));
    };

    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    // Create array for grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="material-icons-round text-blue-500 text-lg">calendar_month</span>
                    Lịch hoạt động
                </h2>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
                    <button
                        onClick={prevMonth}
                        className="p-0.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                    >
                        <span className="material-icons-round text-slate-500 text-base">chevron_left</span>
                    </button>
                    <span className="text-xs font-semibold px-1.5 min-w-[60px] text-center text-slate-700 dark:text-slate-300">
                        {month}/{year}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-0.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                    >
                        <span className="material-icons-round text-slate-500 text-base">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 flex-0 content-start">
                {dayNames.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">
                        {d}
                    </div>
                ))}

                {days.map((day, idx) => {
                    if (!day) return <div key={idx} className="h-7"></div>;

                    const active = isActiveDay(day);

                    return (
                        <div key={idx} className="h-7 p-0.5">
                            <div className={`
                                w-full h-full rounded-md flex items-center justify-center text-xs font-medium transition-all relative
                                ${active
                                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30 font-bold'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }
                            `}>
                                {day}
                                {active && (
                                    <span className="absolute bottom-0.5 w-0.5 h-0.5 rounded-full bg-white/80"></span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Đã lái xe</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span>Nghỉ</span>
                </div>
            </div>
        </Card>
    );
}
