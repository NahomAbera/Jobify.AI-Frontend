import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TextInput, Button, Alert } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
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
          <h1 className="text-4xl font-bold">Jobify<span className="text-white">.AI</span></h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <Alert color="failure">{error}</Alert>}
          
          <div>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full bg-gray-800/50 text-white border-gray-700 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <Button
            type="submit"
            isProcessing={loading}
            className="w-full py-3 rounded-lg font-medium hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #e8e8e9 0%, #00050d 100%)'
            }}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/request-access" className="text-sm text-gray-300 hover:text-white">
            Need access?
          </Link>
        </div>
      </div>
    </div>
  );
}
