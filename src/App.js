import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Importar el nuevo Footer
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import ManageParking from './components/ManageParking';
import ManageSpaces from './components/ManageSpaces';
import ManageUsers from './components/ManageUsers';
import UserView from './components/UserView';
import ParkingDetails from './components/ParkingDetails';
import UserReservations from './components/UserReservations'; // Importar la nueva vista
import QrScanner from './components/QrScanner'; // Importar la nueva vista de QR Scanner

function App() {
  return (
    <Router basename="/bike-parking-iot">
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/manage-parking" element={<PrivateRoute><ManageParking /></PrivateRoute>} />
              <Route path="/manage-spaces/:parkingId" element={<PrivateRoute><ManageSpaces /></PrivateRoute>} />
              <Route path="/manage-users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
              <Route path="/user-view" element={<PrivateRoute><UserView /></PrivateRoute>} />
              <Route path="/parking-details/:parkingId" element={<PrivateRoute><ParkingDetails /></PrivateRoute>} />
              <Route path="/user-reservations" element={<PrivateRoute><UserReservations /></PrivateRoute>} /> {/* Nueva ruta */}
              <Route path="/qr-scanner" element={<PrivateRoute><QrScanner /></PrivateRoute>} /> {/* Nueva ruta de QR Scanner */}
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
          </div>
          <Footer /> {/* Agregar el Footer */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
