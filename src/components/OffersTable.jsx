import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Spinner } from 'flowbite-react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import OffersModal from './OffersModal';

export default function OffersTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch helper
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
      .from('offers')
      .select('*')
      .in('application_id', ids)
      .order('offer_date', { ascending: false });
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
    if (!window.confirm('Delete this offer?')) return;
    await supabase.from('offers').delete().eq('offer_id', id);
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
          <TableHeadCell>Offer Date</TableHeadCell>
          <TableHeadCell>Salary / Comp</TableHeadCell>
          <TableHeadCell>Location</TableHeadCell>
          <TableHeadCell>Deadline</TableHeadCell>
          <TableHeadCell>Accepted?</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {rows.map((row) => (
            <TableRow key={row.id || row.offer_id} className="bg-gray-700/30 border-gray-600">
              <TableCell>{row.company_name}</TableCell>
              <TableCell>{row.position_title}</TableCell>
              <TableCell>{new Date(row.offer_date).toLocaleDateString()}</TableCell>
              <TableCell>{row.salary_comp}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{row.deadline_to_accept ? new Date(row.deadline_to_accept).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{row.accepted_or_declined ? '✅' : '❌'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button color="light" size="xs" onClick={() => openEdit(row)}>
                    <PencilSquareIcon className="h-4 w-4" />
                  </Button>
                  <Button color="failure" size="xs" onClick={() => handleDelete(row.id || row.offer_id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <OffersModal show={modalOpen} onClose={handleCloseModal} initial={editItem} />
    </>
  );
}
