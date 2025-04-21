import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RejectionModal({ show, onClose, initial }) {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    id: null,
    application_id: '',
    company: '',
    position: '',
    rejection_date: '',
  });
  const isEdit = Boolean(form.id);

  useEffect(() => {
    async function fetchApps() {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      const { data } = await supabase
        .from('applications')
        .select('application_id, company_name, position_title')
        .eq('user_email_id', userEmail)
        .order('company_name', { ascending: true });
      setApps(data || []);
    }
    fetchApps();
  }, []);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        application_id: initial.application_id,
        company: initial.company_name || initial.company,
        position: initial.position_title || initial.position,
        rejection_date: initial.rejection_date?.split('T')[0] ?? '',
      });
    } else {
      setForm({ id: null, application_id: '', company: '', position: '', rejection_date: '' });
    }
  }, [initial]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAppSelect = (e) => {
    const appId = e.target.value;
    const app = apps.find((a) => a.application_id === appId);
    setForm((f) => ({
      ...f,
      application_id: appId,
      company: app?.company_name || '',
      position: app?.position_title || '',
    }));
  };

  const handleSubmit = async () => {
    if (!form.application_id) {
      alert('Please select an application.');
      return;
    }
    const dataObj = {
      application_id: form.application_id,
      company_name: form.company,
      position_title: form.position,
      rejection_date: form.rejection_date || new Date().toISOString(),
    };
    if (isEdit) {
      await supabase.from('rejections').update(dataObj).eq('id', form.id);
    } else {
      await supabase.from('rejections').insert(dataObj);
    }
    onClose(true);
  };

  return (
    <Modal show={show} onClose={() => onClose(false)}>
      <ModalHeader>{isEdit ? 'Edit Rejection' : 'Add Rejection'}</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="application_id">Application</Label>
            <Select id="application_id" value={form.application_id} onChange={handleAppSelect}>
              <option value="">Select application</option>
              {apps.map((a) => (
                <option key={a.application_id} value={a.application_id}>
                  {a.company_name} — {a.position_title}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <TextInput id="company" name="company" value={form.company} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <TextInput id="position" name="position" value={form.position} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="rejection_date">Rejection Date</Label>
            <TextInput id="rejection_date" type="date" name="rejection_date" value={form.rejection_date} onChange={handleChange} />
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
