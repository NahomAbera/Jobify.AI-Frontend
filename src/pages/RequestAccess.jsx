import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Label, TextInput, Button, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function RequestAccess() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1615392519955-bc7443eba152?ixlib=rb-1.2.1&q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="w-full max-w-sm p-8 rounded-xl relative z-10" style={{
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Request Access</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert color="failure">{error}</Alert>}
          {success && <Alert color="success">Account created! Check your email.</Alert>}
          <div>
            <Label value="Full Name" className="block text-sm font-medium text-gray-300 mb-1" />
            <TextInput
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
              required
            />
          </div>
          <div>
            <Label value="Email" className="block text-sm font-medium text-gray-300 mb-1" />
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
              required
            />
          </div>
          <div>
            <Label value="Password" className="block text-sm font-medium text-gray-300 mb-1" />
            <TextInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
              required
            />
          </div>
          <div>
            <Label value="Confirm Password" className="block text-sm font-medium text-gray-300 mb-1" />
            <TextInput
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
              required
            />
          </div>
          <Button
            type="submit"
            isProcessing={loading}
            className="w-full py-3 rounded-lg font-medium hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e8e8e9 0%, #00050d 100%)' }}
          >
            Create Account
          </Button>
          <div className="text-center text-sm text-gray-300">
            <Link to="/login" className="hover:text-white">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
