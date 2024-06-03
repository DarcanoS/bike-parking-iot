import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import updateSpaceStatus from '../utils/updateSpaceStatus';

const QrScanner = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const qrRef = useRef(null);

  const handleQrScan = async (result) => {
    if (result && scanning) {
      setScanning(false);
      try {
        const [parkingId, token] = result.split('&').map(param => param.split('=')[1]);

        const parkingDoc = await getDoc(doc(db, 'parkings', parkingId));
        if (!parkingDoc.exists()) {
          alert('El parqueadero no fue encontrado.');
          setShowScanner(false);
          return;
        }

        const parkingData = parkingDoc.data();
        const space = parkingData.spaces.find(space => space.token === token);

        const reservationQuery = query(collection(db, 'reservations'), where('userId', '==', currentUser.uid));
        const reservationSnapshot = await getDocs(reservationQuery);

        if (!reservationSnapshot.empty) {
          alert('Ya tienes una reserva o un espacio en uso.');
          setShowScanner(false);
          return;
        }

        if (!space || space.status !== 'available') {
          alert('El espacio de estacionamiento no está disponible.');
          setShowScanner(false);
          return;
        } else {
          const spaceIndex = parkingData.spaces.findIndex(s => s.token === token);
          const updatedSpaces = [...parkingData.spaces];
          updatedSpaces[spaceIndex].status = 'in use';

          await updateDoc(doc(db, 'parkings', parkingId), { spaces: updatedSpaces });

          await addDoc(collection(db, 'reservations'), {
            userId: currentUser.uid,
            spaceId: updatedSpaces[spaceIndex].id,
            parkingId,
            status: 'in use',
            timestamp: Date.now(),
          });

          updateSpaceStatus(token, 0);

          alert('Espacio de estacionamiento en uso');
          navigate('/user-reservations');
          window.location.reload(); // Recargar la página
        }
      } catch (error) {
        console.error('Error procesando el código QR: ', error);
        setShowScanner(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleStartScanning = () => {
    setShowScanner(true);
    setScanning(true);
  };

  const toggleCamera = () => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "environment" ? "user" : "environment"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900">Escanear Código QR</h2>
          <button
            onClick={() => navigate(-1)}
            className="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md group hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Atrás
          </button>
        </div>
        {!showScanner && (
          <button
            onClick={handleStartScanning}
            className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Activar Escáner
          </button>
        )}
        {showScanner && (
          <div className="mt-8">
            <button
              onClick={toggleCamera}
              className="flex justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cambiar Cámara
            </button>
            <QrReader
              ref={qrRef}
              delay={300}
              onError={handleError}
              onResult={(result) => {
                if (result) {
                  handleQrScan(result?.text);
                }
              }}
              style={{ width: '100%' }}
              constraints={{ facingMode }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
