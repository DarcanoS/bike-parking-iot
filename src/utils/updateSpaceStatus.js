// src/utils/updateSpaceStatus.js
import axios from 'axios';

const updateSpaceStatus = async (token, status) => {
  const baseUrl = 'https://ny3.blynk.cloud/external/api/update';
  const url = `${baseUrl}?token=${token}&V0=${status}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error updating space status:', error);
    // No lanzar el error para que el proceso continúe
  }
};

export default updateSpaceStatus;
