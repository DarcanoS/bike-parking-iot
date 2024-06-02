import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ManageParking = () => {
  const [parkings, setParkings] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [spaces, setSpaces] = useState(0);
  const [reservationDuration, setReservationDuration] = useState(0);
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkings = async () => {
      const parkingsCollection = collection(db, 'parkings');
      const parkingsSnapshot = await getDocs(parkingsCollection);
      const parkingsList = parkingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParkings(parkingsList);
    };

    fetchParkings();
  }, []);

  const handleAddParking = async (e) => {
    e.preventDefault();

    const newParking = {
      name,
      address,
      location,
      spaces: Array.from({ length: spaces }, (_, i) => ({
        id: `space-${i + 1}`,
        token: `token-${i + 1}`,
        status: 'available'
      })),
      reservationDuration,
      pricePerMinute,
    };

    try {
      await addDoc(collection(db, 'parkings'), newParking);
      setParkings([...parkings, newParking]);
      setName('');
      setAddress('');
      setLocation({ latitude: '', longitude: '' });
      setSpaces(0);
      setReservationDuration(0);
      setPricePerMinute(0);
      alert('Parqueadero agregado exitosamente');
    } catch (error) {
      console.error('Error agregando parqueadero: ', error);
    }
  };

  const handleEditParking = (parking) => {
    setName(parking.name);
    setAddress(parking.address);
    setLocation(parking.location);
    setSpaces(parking.spaces.length);
    setReservationDuration(parking.reservationDuration);
    setPricePerMinute(parking.pricePerMinute);
    setEditing(parking.id);
  };

  const handleUpdateParking = async (e) => {
    e.preventDefault();

    const updatedParking = {
      name,
      address,
      location,
      reservationDuration,
      pricePerMinute,
    };

    try {
      await updateDoc(doc(db, 'parkings', editing), updatedParking);
      setParkings(parkings.map(parking => parking.id === editing ? { ...parking, ...updatedParking } : parking));
      setName('');
      setAddress('');
      setLocation({ latitude: '', longitude: '' });
      setSpaces(0);
      setReservationDuration(0);
      setPricePerMinute(0);
      setEditing(null);
      alert('Parqueadero actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando parqueadero: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Gestionar Parqueaderos</h2>
        <form className="mt-8 space-y-6" onSubmit={editing ? handleUpdateParking : handleAddParking}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="sr-only">Dirección</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="latitude" className="sr-only">Latitud</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Latitud"
                value={location.latitude}
                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="longitude" className="sr-only">Longitud</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Longitud"
                value={location.longitude}
                onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="spaces" className="sr-only">Cantidad de Espacios</label>
              <input
                id="spaces"
                name="spaces"
                type="number"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Cantidad de Espacios"
                value={spaces}
                onChange={(e) => setSpaces(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="reservationDuration" className="sr-only">Duración de la Reserva (minutos)</label>
              <input
                id="reservationDuration"
                name="reservationDuration"
                type="number"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Duración de la Reserva (minutos)"
                value={reservationDuration}
                onChange={(e) => setReservationDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="pricePerMinute" className="sr-only">Precio por Minuto</label>
              <input
                id="pricePerMinute"
                name="pricePerMinute"
                type="number"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Precio por Minuto"
                value={pricePerMinute}
                onChange={(e) => setPricePerMinute(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editing ? 'Actualizar Parqueadero' : 'Agregar Parqueadero'}
            </button>
          </div>
        </form>
        <div className="mt-12">
          <h3 className="text-2xl font-bold">Lista de Parqueaderos</h3>
          {parkings.map((parking) => (
            <div key={parking.id} className="p-4 mt-4 bg-white border rounded-md shadow-md">
              <p><strong>Nombre:</strong> {parking.name}</p>
              <p><strong>Dirección:</strong> {parking.address}</p>
              <p><strong>Ubicación:</strong> {parking.location.latitude}, {parking.location.longitude}</p>
              <p><strong>Espacios:</strong> {parking.spaces.length}</p>
              <p><strong>Duración de la Reserva:</strong> {parking.reservationDuration} minutos</p>
              <p><strong>Precio por Minuto:</strong> ${parking.pricePerMinute}</p>
              <button
                onClick={() => handleEditParking(parking)}
                className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar Parqueadero
              </button>
              <button
                onClick={() => navigate(`/manage-spaces/${parking.id}`)}
                className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Configurar Espacios
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageParking;
