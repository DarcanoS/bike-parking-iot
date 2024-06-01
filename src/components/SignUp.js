import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Las contraseñas no coinciden');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { role: 'user' });
      navigate('/');
    } catch {
      setError('Fallo en la creación de la cuenta');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registrarse</h2>
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Correo Electrónico"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <input
            type="password"
            ref={passwordRef}
            required
            placeholder="Contraseña"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <input
            type="password"
            ref={passwordConfirmRef}
            required
            placeholder="Confirmar Contraseña"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <button
            disabled={loading}
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center mt-4">
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-900">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
