# Proyecto de Automatización de Parqueadero de Bicicletas con IoT

## Descripción

Este proyecto tiene como objetivo la automatización de un parqueadero de bicicletas utilizando IoT. La aplicación permite a los usuarios reservar y utilizar espacios de estacionamiento de bicicletas a través de una aplicación web. Además, proporciona una interfaz de administración para gestionar usuarios y parqueaderos.

## Características

### Para Usuarios Normales

- Ver lista de parqueaderos disponibles.
- Ver detalles de los parqueaderos, incluyendo nombre, dirección y ubicación en un mapa.
- Reservar un espacio de estacionamiento.
- Utilizar un espacio de estacionamiento.
- Ver sus reservas actuales y el tiempo restante.

### Para Administradores

- Gestionar usuarios (agregar, editar, eliminar).
- Gestionar parqueaderos (agregar, editar, eliminar).
- Configurar espacios de estacionamiento para cada parqueadero.
- Generar códigos QR para los espacios de estacionamiento.

## Tecnologías Utilizadas

- **Frontend:** React, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore)
- **Mapa:** Mapbox GL
- **Código QR:** qrcode.react

## Requisitos Previos

- Node.js y npm instalados en tu máquina.
- Una cuenta en Firebase.
- Un token de Mapbox.

## Configuración del Proyecto

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/darcanos/bike-parking-iot.git
cd bike-parking-iot
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase

1. Crea un proyecto en Firebase.
2. Habilita Authentication y Firestore.
3. Copia la configuración de Firebase y pégala en un archivo `firebase-config.js` en la carpeta `src`:

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
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

### Paso 4: Configurar Mapbox

1. Obtén un token de acceso de Mapbox.
2. Añádelo en el componente `Map.js`:

```javascript
const MAPBOX_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN';
```

### Paso 5: Configurar Tailwind CSS

1. Inicializa Tailwind CSS en el proyecto:

```bash
npx tailwindcss init -p
```

2. Configura el archivo `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Añade las directivas de Tailwind CSS en el archivo `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Paso 6: Ejecutar la Aplicación en Desarrollo

```bash
npm start
```

### Paso 7: Desplegar en GitHub Pages

1. Asegúrate de tener el paquete `gh-pages` instalado:

```bash
npm install gh-pages --save-dev
```

2. Agrega los siguientes scripts a tu `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  ...
}
```

3. Despliega la aplicación:

```bash
npm run deploy
```

## Estructura del Proyecto

```
src/
  components/
    ManageUsers.js
    ManageParking.js
    ManageSpaces.js
    SignIn.js
    SignUp.js
    Home.js
    Navbar.js
    PrivateRoute.js
    UserView.js
    ParkingDetails.js
    UserReservations.js
    Map.js
    QrScanner.js
  contexts/
    AuthContext.js
  firebase-config.js
  utils/
    updateSpaceStatus.js
  App.js
  index.js
  index.css
tailwind.config.js
package.json
README.md
```

## Dependencias

Para instalar todas las dependencias necesarias, usa el siguiente comando:

```bash
npm install react-router-dom firebase mapbox-gl qrcode.react axios
```

Si encuentras problemas con las dependencias, intenta usar:

```bash
npm install --legacy-peer-deps
```