import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Checkbox, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function OffersModal({ show, onClose, initial }) {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    id: null,
    application_id: '',
    company: '',
    position: '',
    offer_date: '',
    salary_comp: '',
    location: '',
    deadline_to_accept: '',
    accepted_or_declined: false,
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
        offer_date: initial.offer_date?.split('T')[0] ?? '',
        salary_comp: initial.salary_comp ?? '',
        location: initial.location ?? '',
        deadline_to_accept: initial.deadline_to_accept?.split('T')[0] ?? '',
        accepted_or_declined: initial.accepted_or_declined ?? false,
      });
    } else {
      setForm({
        id: null,
        application_id: '',
        company: '',
        position: '',
        offer_date: '',
        salary_comp: '',
        location: '',
        deadline_to_accept: '',
        accepted_or_declined: false,
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
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
      offer_date: form.offer_date || new Date().toISOString(),
      salary_comp: form.salary_comp,
      location: form.location,
      deadline_to_accept: form.deadline_to_accept || null,
      accepted_or_declined: form.accepted_or_declined,
    };
    if (isEdit) {
      await supabase.from('offers').update(dataObj).eq('id', form.id);
    } else {
      await supabase.from('offers').insert(dataObj);
    }
    onClose(true);
  };

  return (
    <Modal show={show} onClose={() => onClose(false)}>
      <ModalHeader>{isEdit ? 'Edit Offer' : 'Add Offer'}</ModalHeader>
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
            <Label htmlFor="offer_date">Offer Date</Label>
            <TextInput id="offer_date" type="date" name="offer_date" value={form.offer_date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="salary_comp">Salary / Compensation</Label>
            <TextInput id="salary_comp" name="salary_comp" value={form.salary_comp} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <TextInput id="location" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="deadline_to_accept">Deadline to Accept</Label>
            <TextInput id="deadline_to_accept" type="date" name="deadline_to_accept" value={form.deadline_to_accept} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="accepted_or_declined" name="accepted_or_declined" checked={form.accepted_or_declined} onChange={handleChange} />
            <Label htmlFor="accepted_or_declined">Accepted</Label>
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
