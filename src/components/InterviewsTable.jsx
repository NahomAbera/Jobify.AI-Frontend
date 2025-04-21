import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Spinner } from 'flowbite-react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import InterviewModal from './InterviewModal';

export default function InterviewsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch rows helper
  const fetchRows = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email;
    const { data: apps } = await supabase
      .from('applications')
      .select('application_id')
      .eq('user_email_id', userEmail);
    const ids = apps?.map((a) => a.application_id) || [];
    if (!ids.length) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('interviews')
      .select('*')
      .in('application_id', ids)
      .order('invitation_date', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (refresh) fetchRows();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    await supabase.from('interviews').delete().eq('id', id);
    fetchRows();
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
          <TableHeadCell>Round</TableHeadCell>
          <TableHeadCell>Invitation Date</TableHeadCell>
          <TableHeadCell>Deadline</TableHeadCell>
          <TableHeadCell>Completed</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {rows.map((row) => (
            <TableRow key={row.id || row.interview_id} className="bg-gray-700/30 border-gray-600">
              <TableCell>{row.company_name}</TableCell>
              <TableCell>{row.position_title}</TableCell>
              <TableCell>{row.round}</TableCell>
              <TableCell>{new Date(row.invitation_date).toLocaleDateString()}</TableCell>
              <TableCell>{row.deadline_date ? new Date(row.deadline_date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{row.completed ? '✅' : '❌'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button color="light" size="xs" onClick={() => openEdit(row)}>
                    <PencilSquareIcon className="h-4 w-4" />
                  </Button>
                  <Button color="failure" size="xs" onClick={() => handleDelete(row.id || row.interview_id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InterviewModal show={modalOpen} onClose={handleCloseModal} initial={editItem} />
    </>
  );
}
