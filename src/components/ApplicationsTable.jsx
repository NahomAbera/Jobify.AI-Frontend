import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Spinner } from 'flowbite-react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import ApplicationModal from './ApplicationModal';

export default function ApplicationsTable({ statusFilter = null }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  async function fetchApps() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email;
    // fetch rows owned by the logged‑in email
    let query = supabase.from('applications')
      .select('application_id, company_name, position_title, application_date')
      .order('application_date', { ascending: false })
      .eq('user_email_id', userEmail);
    const { data, error } = await query;
    if (!error) {
      const mapped = data.map((d) => ({
        id: d.application_id,
        company: d.company_name,
        position: d.position_title,
        status: '',
        applied_date: d.application_date,
      }));
      setApps(mapped);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };
  const handleCloseModal = (refresh) => {
    setModalOpen(false);
    if (refresh) fetchApps();
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    await supabase.from('applications').delete().eq('application_id', id);
    fetchApps();
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
      <Table hoverable>
        <TableHead>
          <TableHeadCell>Company</TableHeadCell>
          <TableHeadCell>Position</TableHeadCell>
          <TableHeadCell>Date Applied</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {apps.map((app) => (
            <TableRow key={app.id} className="bg-gray-700/30 border-gray-600">
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.position}</TableCell>
              <TableCell>{new Date(app.applied_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button color="light" size="xs" onClick={() => openEdit(app)}>
                    <PencilSquareIcon className="h-4 w-4" />
                  </Button>
                  <Button color="failure" size="xs" onClick={() => handleDelete(app.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ApplicationModal show={modalOpen} onClose={handleCloseModal} initial={editItem} />
    </>
  );
}
