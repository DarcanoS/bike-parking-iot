import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

function ManageSpaces() {
  const { parkingId } = useParams();
  const [spaces, setSpaces] = useState([]);
  const [token, setToken] = useState('');
  const [parking, setParking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParking = async () => {
      const parkingRef = doc(db, 'parkings', parkingId);
      const parkingDoc = await getDoc(parkingRef);
      if (parkingDoc.exists()) {
        const parkingData = parkingDoc.data();
        setParking(parkingData);
        setSpaces(Array.isArray(parkingData.spaces) ? parkingData.spaces : []);
      }
    };
    fetchParking();
  }, [parkingId]);

  const handleAddSpace = async () => {
    const newSpace = {
      id: new Date().getTime().toString(),
      token,
      status: 'available',
    };
    const updatedSpaces = [...spaces, newSpace];
    setSpaces(updatedSpaces);
    await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
    setToken('');
  };

  const handleDeleteSpace = async (spaceId) => {
    const updatedSpaces = spaces.filter(space => space.id !== spaceId);
    setSpaces(updatedSpaces);
    await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Gestionar Espacios de Estacionamiento</h2>
          <button
            onClick={() => navigate(-1)}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        <div className="mt-6">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token del Espacio"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <button
            onClick={handleAddSpace}
            className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Espacio
          </button>
        </div>
        <div className="mt-6">
          {Array.isArray(spaces) && spaces.map((space, index) => (
            <div key={space.id} className="mt-4 p-4 border rounded-md bg-white shadow-md">
              <p><strong>Espacio:</strong> {index + 1}</p>
              <p><strong>Estado:</strong> {space.status}</p>
              <QRCode value={`${parkingId}-${space.token}`} />
              <button
                onClick={() => handleDeleteSpace(space.id)}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageSpaces;
