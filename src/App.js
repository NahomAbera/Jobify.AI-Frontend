import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import Offers from './pages/Offers';
import Rejections from './pages/Rejections';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import { supabase } from './lib/supabaseClient';

function ProtectedRoute({ children }) {
  const [session, setSession] = React.useState(undefined);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // loading
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-900 min-h-screen text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/request-access" element={<RequestAccess />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
            <Route path="/rejections" element={<ProtectedRoute><Rejections /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
