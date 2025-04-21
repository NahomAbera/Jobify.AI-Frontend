import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const statuses = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ApplicationModal({ show, onClose, initial }) {
  const [form, setForm] = useState({
    id: null,
    company: '',
    position: '',
    status: 'applied',
    applied_date: '',
  });
  const isEdit = Boolean(form.id);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        company: initial.company,
        position: initial.position,
        status: initial.status,
        applied_date: initial.applied_date?.split('T')[0] ?? '',
      });
    } else {
      setForm({ id: null, company: '', position: '', status: 'applied', applied_date: '' });
    }
  }, [initial]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isEdit) {
      await supabase.from('applications').update({
        company_name: form.company,
        position_title: form.position,
        status: form.status,
        applied_date: form.applied_date,
      }).eq('application_id', form.id);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      await supabase.from('applications').insert({
        company_name: form.company,
        position_title: form.position,
        status: form.status,
        applied_date: form.applied_date || new Date().toISOString(),
        user_email_id: userEmail,
      });
    }
    onClose(true);
  };

  return (
    <Modal show={show} onClose={() => onClose(false)}>
      <ModalHeader>{isEdit ? 'Edit Application' : 'Add Application'}</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="company">Company</Label>
            <TextInput id="company" name="company" value={form.company} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <TextInput id="position" name="position" value={form.position} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" value={form.status} onChange={handleChange}>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="applied_date">Applied Date</Label>
            <TextInput id="applied_date" type="date" name="applied_date" value={form.applied_date} onChange={handleChange} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="flex justify-between border-t border-gray-600 pt-4 sticky bottom-0 bg-gray-800">
        <Button onClick={handleSubmit} className="mr-2 px-6 py-2 text-base font-medium" color="success">{isEdit ? 'Save' : 'Add'}</Button>
        <Button color="gray" onClick={() => onClose(false)} className="px-4">Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
