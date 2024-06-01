import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [editUserId, setEditUserId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [error, setError] = useState('');

  const usersCollectionRef = collection(db, 'users');

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, [usersCollectionRef]);

  const handleAddUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      const user = userCredential.user;
      await addDoc(usersCollectionRef, { email: user.email, role: newRole, id: user.uid });
      setUsers([...users, { email: user.email, role: newRole, id: user.uid }]);
      setNewEmail('');
      setNewPassword('');
      setNewRole('user');
      setError('');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso.');
      } else {
        setError('Error al crear el usuario: ' + error.message);
      }
    }
  };

  const handleEditUser = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { email: editEmail, role: editRole });
    setUsers(users.map((user) => (user.id === userId ? { ...user, email: editEmail, role: editRole } : user)));
    setEditUserId(null);
    setEditEmail('');
    setEditRole('');
  };

  const handleDeleteUser = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Gestionar Usuarios</h2>
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            onClick={handleAddUser}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Usuario
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>
        <div>
          {users.map((user) => (
            <div key={user.id} className="mt-4">
              {editUserId === user.id ? (
                <>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Guardar Cambios
                  </button>
                </>
              ) : (
                <>
                  <p>Correo Electrónico: {user.email}</p>
                  <p>Rol: {user.role}</p>
                  <button
                    onClick={() => {
                      setEditUserId(user.id);
                      setEditEmail(user.email);
                      setEditRole(user.role);
                    }}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
