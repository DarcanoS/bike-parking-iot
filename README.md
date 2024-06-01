# Parqueadero de Bicicletas IoT

Este proyecto es una aplicación web para la gestión y automatización de un parqueadero de bicicletas utilizando IoT. Incluye autenticación de usuarios, roles de usuario y administrador, y diferentes funcionalidades basadas en estos roles.

## Descripción

### Funcionalidades

- **Autenticación de Usuarios**:
  - Registro de nuevos usuarios.
  - Inicio de sesión para usuarios registrados.
  - Cierre de sesión.

- **Roles de Usuario**:
  - **Usuario**: Puede ver su perfil y acceder a funcionalidades básicas.
  - **Administrador**: Puede gestionar usuarios y parqueaderos.

- **Páginas**:
  - **Inicio**: Página de bienvenida con el correo electrónico del usuario.
  - **Panel de Administración**: Página para que los administradores gestionen la aplicación.
  - **Gestionar Usuarios**: Página para que los administradores gestionen los usuarios.
  - **Gestionar Parqueaderos**: Página para que los administradores gestionen los parqueaderos.

## Tecnologías Utilizadas

- **Frontend**: React, Tailwind CSS.
- **Backend**: Firebase (Autenticación y Firestore para la base de datos).
- **Despliegue**: GitHub Pages.

## Instalación y Configuración

### Requisitos

- Node.js
- npm (Node Package Manager)

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/bike-parking-iot.git
cd bike-parking-iot
```

### Instalar Dependencias

```bash
npm install
```

### Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita la autenticación por correo y contraseña.
3. Configura Firestore Database y crea una colección `users`.
4. Añade un documento para el administrador con el siguiente formato:

   ```json
   {
     "email": "admin@example.com",
     "role": "admin"
   }
   ```

5. Copia la configuración de Firebase y reemplaza los valores en `firebase-config.js`:

   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);

   export { auth, db };
   ```

### Ejecutar la Aplicación

Para ejecutar la aplicación localmente, usa el siguiente comando:

```bash
npm start
```

### Desplegar la Aplicación

Para desplegar la aplicación en GitHub Pages, sigue estos pasos:

1. Asegúrate de tener configurado el campo `homepage` en `package.json` con la URL de tu repositorio:

   ```json
   "homepage": "https://darcanos.github.io/bike-parking-iot",
   ```

2. Ejecuta el siguiente comando para desplegar:

   ```bash
   npm run deploy
   ```

## Estructura del Proyecto

```plaintext
src/
├── components/
│   ├── AuthProvider.js
│   ├── Home.js
│   ├── SignIn.js
│   ├── SignUp.js
│   ├── AdminDashboard.js
│   ├── ManageUsers.js
│   ├── ManageParking.js
│   ├── Navbar.js
│   ├── PrivateRoute.js
│   ├── AdminRoute.js
│   └── Logout.js
├── firebase-config.js
├── App.js
├── index.css
├── index.js
└── reportWebVitals.js
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor realiza un fork del repositorio y crea una pull request con tus cambios.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.