import React from 'react';
import StatsCard from '../components/StatsCard';
import StatsChart from '../components/StatsChart';
import StatsPie from '../components/StatsPie';
import { supabase } from '../lib/supabaseClient';
import { BriefcaseIcon, CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [counts, setCounts] = React.useState({ applications: 0, interviews: 0, offers: 0, rejections: 0 });

  React.useEffect(() => {
    async function fetchCounts() {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;

      const { data: apps, error: appsErr } = await supabase
        .from('applications')
        .select('application_id')
        .eq('user_email_id', userEmail);

      if (appsErr) return;

      const ids = apps.map((a) => a.application_id);
      const totals = { applications: ids.length, interviews: 0, offers: 0, rejections: 0 };

      if (ids.length) {
        const [{ count: intCount }, { count: offCount }, { count: rejCount }] = await Promise.all([
          supabase.from('interviews').select('id', { count: 'exact', head: true }).in('application_id', ids),
          supabase.from('offers').select('company_name', { count: 'exact', head: true }).in('application_id', ids),
          supabase.from('rejections').select('company_name', { count: 'exact', head: true }).in('application_id', ids),
        ]);

        totals.interviews = intCount || 0;
        totals.offers = offCount || 0;
        totals.rejections = rejCount || 0;
      }

      setCounts(totals);
    }
    fetchCounts();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Applications" value={counts.applications} icon={BriefcaseIcon} color="indigo" />
        <StatsCard title="Interviews" value={counts.interviews} icon={CalendarDaysIcon} color="sky" />
        <StatsCard title="Offers" value={counts.offers} icon={CheckCircleIcon} color="emerald" />
        <StatsCard title="Rejections" value={counts.rejections} icon={XCircleIcon} color="rose" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <StatsChart counts={counts} />
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <StatsPie counts={counts} />
        </div>
      </div>
    </div>
  );
}
