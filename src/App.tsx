import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Participants } from './pages/Participants';
import { Activities } from './pages/Activities';
import { Scoreboard } from './pages/Scoreboard';
import { Admin } from './pages/Admin';
import { Navigation } from './components/Navigation';
import { getCurrentUser } from './lib/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/participants"
              element={
                <ProtectedRoute>
                  <Participants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scoreboard"
              element={
                <ProtectedRoute>
                  <Scoreboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;