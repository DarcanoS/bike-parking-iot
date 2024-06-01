import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Map from './Map';

function UserView() {
  const [parkings, setParkings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getParkings = async () => {
      const data = await getDocs(collection(db, 'parkings'));
      setParkings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getParkings();
  }, []);

  const handleViewDetails = (parkingId) => {
    navigate(`/parking-details/${parkingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Lista de Parqueaderos</h2>
        </div>
        <div>
          {parkings.map((parking) => (
            <div key={parking.id} className="mt-4 p-4 border rounded-md bg-white shadow-md">
              <p><strong>Nombre:</strong> {parking.name}</p>
              <p><strong>Dirección:</strong> {parking.address}</p>
              <button
                onClick={() => handleViewDetails(parking.id)}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserView;
