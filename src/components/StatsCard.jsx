import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const colorMap = {
  indigo: 'from-indigo-600 to-indigo-500',
  sky: 'from-sky-600 to-sky-500',
  emerald: 'from-emerald-600 to-emerald-500',
  rose: 'from-rose-600 to-rose-500',
};

export default function StatsCard({ title, value, icon: Icon = ArrowTrendingUpIcon, color = 'indigo' }) {
  return (
    <div
      className={clsx(
        'flex flex-col justify-between rounded-xl p-6 shadow-lg text-white min-w-[150px] bg-gradient-to-br',
        colorMap[color] || colorMap.indigo
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <Icon className="h-6 w-6 opacity-90" />
      </div>
      <span className="text-3xl font-semibold">{value ?? 0}</span>
    </div>
  );
}
