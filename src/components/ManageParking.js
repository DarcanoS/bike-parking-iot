import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ManageParking = () => {
  const [parkings, setParkings] = useState([]);
  const [parkingName, setParkingName] = useState('');
  const [parkingAddress, setParkingAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkings = async () => {
      const parkingCollection = collection(db, 'parkings');
      const parkingSnapshot = await getDocs(parkingCollection);
      const parkingList = parkingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParkings(parkingList);
    };

    fetchParkings();
  }, []);

  const handleAddParking = async (e) => {
    e.preventDefault();

    const newParking = {
      name: parkingName,
      address: parkingAddress,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      spaces: []
    };

    try {
      await addDoc(collection(db, 'parkings'), newParking);
      setParkingName('');
      setParkingAddress('');
      setLatitude('');
      setLongitude('');
      alert('Parqueadero agregado exitosamente');
      navigate('/manage-parking');
    } catch (error) {
      console.error('Error agregando parqueadero: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Gestionar Parqueaderos</h2>
        <form className="mt-8 space-y-6" onSubmit={handleAddParking}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="parking-name" className="sr-only">Nombre del Parqueadero</label>
              <input
                id="parking-name"
                name="parking-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre del Parqueadero"
                value={parkingName}
                onChange={(e) => setParkingName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="parking-address" className="sr-only">Dirección del Parqueadero</label>
              <input
                id="parking-address"
                name="parking-address"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Dirección del Parqueadero"
                value={parkingAddress}
                onChange={(e) => setParkingAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="latitude" className="sr-only">Latitud</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Latitud"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="longitude" className="sr-only">Longitud</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Longitud"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Agregar Parqueadero
            </button>
          </div>
        </form>
        <div className="mt-12">
          <h3 className="text-2xl font-bold">Lista de Parqueaderos</h3>
          {parkings.map((parking) => (
            <div key={parking.id} className="mt-4 p-4 border rounded-md bg-white shadow-md">
              <p><strong>Nombre:</strong> {parking.name}</p>
              <p><strong>Dirección:</strong> {parking.address}</p>
              <p><strong>Ubicación:</strong> {`Lat: ${parking.location.latitude}, Lng: ${parking.location.longitude}`}</p>
              <p><strong>Espacios:</strong> {parking.spaces.length}</p>
              <button
                onClick={() => navigate(`/manage-spaces/${parking.id}`)}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
