import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import updateSpaceStatus from '../utils/updateSpaceStatus'; // Importar la función correctamente

const ManageSpaces = () => {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [spaceToken, setSpaceToken] = useState('');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParking = async () => {
      const parkingRef = doc(db, 'parkings', parkingId);
      const parkingSnap = await getDoc(parkingRef);

      if (parkingSnap.exists()) {
        setParking({ id: parkingId, ...parkingSnap.data() });
        setSpaces(parkingSnap.data().spaces || []);
      } else {
        console.log('No such document!');
      }
    };

    fetchParking();
  }, [parkingId]);

  const handleAddSpace = async (e) => {
    e.preventDefault();
    const newSpace = {
      id: `space-${spaces.length + 1}`,
      token: spaceToken,
      status: 'available'
    };

    const updatedSpaces = [...spaces, newSpace];

    try {
      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);
      setSpaceToken('');
      alert('Espacio agregado exitosamente');
    } catch (error) {
      console.error('Error agregando espacio: ', error);
    }
  };

  const handleStatusChange = async (spaceId, newStatus) => {
    const spaceIndex = spaces.findIndex(space => space.id === spaceId);
    const updatedSpaces = [...spaces];
    const space = updatedSpaces[spaceIndex];

    // Eliminar reservas o usos si se cambia a "No Disponible"
    if (newStatus === 'unavailable' && space.status !== 'available') {
      try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        usersSnap.forEach(async (userDoc) => {
          const userData = userDoc.data();
          if (userData.reservedSpace === spaceId || userData.usingSpace === spaceId) {
            await updateDoc(doc(db, 'users', userDoc.id), {
              reservedSpace: arrayRemove(spaceId),
              usingSpace: arrayRemove(spaceId)
            });
          }
        });
      } catch (error) {
        console.error('Error eliminando reserva o uso: ', error);
      }
    }

    space.status = newStatus;
    try {
      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);
      alert('Estado del espacio actualizado exitosamente');

      // Llamar a la función updateSpaceStatus con el token y el estado correspondiente
      await updateSpaceStatus(space.token, newStatus === 'available' ? 1 : 0);

    } catch (error) {
      console.error('Error actualizando el estado del espacio: ', error);
    }
  };

  const handleGenerateQR = (space) => {
    setSelectedSpace(space);
  };

  if (!parking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900">Configurar Espacios - {parking.name}</h2>
          <button
            onClick={() => navigate(-1)}
            className="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAddSpace}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="space-token" className="sr-only">Token del Espacio</label>
              <input
                id="space-token"
                name="space-token"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Token del Espacio"
                value={spaceToken}
                onChange={(e) => setSpaceToken(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Agregar Espacio
            </button>
          </div>
        </form>
        <div className="mt-12">
          <h3 className="text-2xl font-bold">Lista de Espacios</h3>
          {spaces.map((space) => (
            <div key={space.id} className="p-4 mt-4 bg-white border rounded-md shadow-md">
              <p><strong>ID:</strong> {space.id}</p>
              <p><strong>Estado:</strong> {space.status}</p>
              <select
                value={space.status}
                onChange={(e) => handleStatusChange(space.id, e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              >
                <option value="available">Disponible</option>
                <option value="unavailable">No Disponible</option>
              </select>
              <p><strong>Token:</strong> {space.token}</p>
              <button
                onClick={() => handleGenerateQR(space)}
                className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generar QR
              </button>
              {selectedSpace && selectedSpace.id === space.id && (
                <div className="mt-4">
                  <QRCode value={`parkingId=${parkingId}&token=${space.token}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSpaces;
