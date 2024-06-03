import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Map from './Map';
import updateSpaceStatus from '../utils/updateSpaceStatus'; // Importar la función

function ParkingDetails() {
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [userReservation, setUserReservation] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getParking = async () => {
      const docRef = doc(db, 'parkings', parkingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const parkingData = docSnap.data();
        setParking(parkingData);
        setSpaces(Array.isArray(parkingData.spaces) ? parkingData.spaces : []);
      } else {
        console.log('No such document!');
      }
    };

    const getUserReservation = async () => {
      const q = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUserReservation(querySnapshot.docs[0].data());
      }
    };

    getParking();
    getUserReservation();
  }, [parkingId, currentUser.uid]);

  const handleReserve = async (spaceId) => {
    if (userReservation) {
      alert('Ya tienes una reserva o un espacio en uso.');
      return;
    }

    try {
      const spaceIndex = spaces.findIndex(space => space.id === spaceId);
      const updatedSpaces = [...spaces];
      updatedSpaces[spaceIndex].status = 'reserved';

      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);

      // Crear una reserva en Firestore
      await addDoc(collection(db, 'reservations'), {
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'reserved',
        timestamp: Date.now(),
      });

      alert('Espacio reservado exitosamente');
      setUserReservation({
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'reserved',
        timestamp: Date.now(),
      });

      // Llamar a la función updateSpaceStatus con el token y el estado correspondiente
      const space = updatedSpaces[spaceIndex];
      await updateSpaceStatus(space.token, 0); // 0 para reservado

      // Notificar al Navbar sobre la nueva reserva
      localStorage.setItem('newReservation', Date.now());
    } catch (error) {
      console.error('Error reservando el espacio: ', error);
    }
  };

  const handleUse = async (spaceId) => {
    if (userReservation) {
      alert('Ya tienes una reserva o un espacio en uso.');
      return;
    }

    try {
      const spaceIndex = spaces.findIndex(space => space.id === spaceId);
      const updatedSpaces = [...spaces];
      updatedSpaces[spaceIndex].status = 'in use';

      await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });
      setSpaces(updatedSpaces);

      // Crear una reserva en Firestore
      await addDoc(collection(db, 'reservations'), {
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'in use',
        timestamp: Date.now(),
      });

      alert('Espacio en uso');
      setUserReservation({
        userId: currentUser.uid,
        spaceId,
        parkingId,
        status: 'in use',
        timestamp: Date.now(),
      });

      // Llamar a la función updateSpaceStatus con el token y el estado correspondiente
      const space = updatedSpaces[spaceIndex];
      await updateSpaceStatus(space.token, 0); // 0 para en uso

      // Notificar al Navbar sobre el uso
      localStorage.setItem('newReservation', Date.now());
    } catch (error) {
      console.error('Error poniendo en uso el espacio: ', error);
    }
  };

  if (!parking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900">Detalles del Parqueadero</h2>
          <button
            onClick={() => navigate(-1)}
            className="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        <div className="mt-6">
          <p><strong>Nombre:</strong> {parking.name}</p>
          <p><strong>Dirección:</strong> {parking.address}</p>
        </div>
        <div className="mb-72">
          <Map latitude={parseFloat(parking.location.latitude)} longitude={parseFloat(parking.location.longitude)} />
        </div>
        <div><br></br>
        </div>
        <div className="mt-96">
          <h3 className="text-2xl font-bold">Espacios de Estacionamiento</h3>
          {spaces.map((space, index) => (
            <div key={space.id} className="p-4 mt-4 bg-white border rounded-md shadow-md">
              <p><strong>Espacio:</strong> {index + 1}</p>
              <p><strong>Estado:</strong> {space.status}</p>
              {space.status === 'available' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleReserve(space.id)}
                    className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Reservar
                  </button>
                  <button
                    onClick={() => handleUse(space.id)}
                    className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Usar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParkingDetails;
