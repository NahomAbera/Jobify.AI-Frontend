import OffersTable from '../components/OffersTable';
import EntriesBarChart from '../components/EntriesBarChart';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Select } from 'flowbite-react';

export default function Offers() {
  const [dates, setDates] = useState([]);
  const [rangeMs, setRangeMs] = useState(30 * 86400000);
  const [bucket, setBucket] = useState('auto');

  const ranges = [
    { label: '1 day', ms: 1 * 86400000 },
    { label: '5 days', ms: 5 * 86400000 },
    { label: '30 days', ms: 30 * 86400000 },
    { label: '3 months', ms: 90 * 86400000 },
    { label: '6 months', ms: 180 * 86400000 },
    { label: '1 year', ms: 365 * 86400000 },
    { label: '2 years', ms: 730 * 86400000 },
    { label: '3 years', ms: 1095 * 86400000 },
    { label: '4 years', ms: 1460 * 86400000 },
    { label: '5 years', ms: 1825 * 86400000 },
  ];

  useEffect(() => {
    async function fetchDates() {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      const { data: apps } = await supabase
        .from('applications')
        .select('application_id')
        .eq('user_email_id', userEmail);
      const ids = apps?.map((a) => a.application_id) || [];
      if (!ids.length) return;
      const { data } = await supabase
        .from('offers')
        .select('offer_date')
        .in('application_id', ids);
      setDates(data.map((d) => d.offer_date));
    }
    fetchDates();
  }, []);

  const cutoff = Date.now() - rangeMs;
  const filteredDates = dates.filter((d) => new Date(d).getTime() >= cutoff);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Offers</h1>
        <Select value={rangeMs} onChange={(e) => setRangeMs(Number(e.target.value))} className="w-44">
          {ranges.map((r) => (
            <option key={r.ms} value={r.ms}>
              Past {r.label}
            </option>
          ))}
        </Select>
        <Select value={bucket} onChange={(e)=>setBucket(e.target.value)} className="w-40 ml-2">
          <option value="auto">Auto</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="half">Half‑Year</option>
          <option value="year">Year</option>
        </Select>
      </div>
      <EntriesBarChart dates={filteredDates} rangeMs={rangeMs} bucket={bucket} label="Offers over time" color="rgba(16, 185, 129, 0.6)" />
      <OffersTable />
    </div>
  );
}
