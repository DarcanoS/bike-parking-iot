import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageParking from './components/ManageParking';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Logout from './components/Logout';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main className="flex flex-col items-center justify-center mt-8">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/manage-users" element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            } />
            <Route path="/manage-parking" element={
              <AdminRoute>
                <ManageParking />
              </AdminRoute>
            } />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
