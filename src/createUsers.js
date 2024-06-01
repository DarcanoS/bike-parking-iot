const { auth, db } = require('./firebase-config');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, getDoc, setDoc } = require('firebase/firestore');

// Función para crear un usuario con rol
const createUser = async (email, password, role) => {
  try {
    // Verificar si el usuario ya existe en Firestore
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('El usuario ya existe:', email);
      return;
    }

    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Añadir información de rol a Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role,
    });

    console.log('Usuario creado con rol:', role);
  } catch (error) {
    console.error('Error creando el usuario:', error.message);
  }
};

// Crear un usuario normal
createUser('user@example.com', 'password123', 'user');

// Crear un usuario admin
createUser('admin@example.com', 'password123', 'admin');
