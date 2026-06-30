import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const processVideo = async (source, language = 'english') => {
  try {
    const response = await axios.post(`${API_URL}/process-video/`, {
      source,
      language
    });
    return response.data;
  } catch (error) {
    console.error("Error processing video:", error);
    throw error;
  }
};

export const uploadVideo = async (file, language = 'english') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    
    const response = await axios.post(`${API_URL}/upload-video/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

export const askQuestion = async (question, transcript) => {
  try {
    const response = await axios.post(`${API_URL}/ask/`, {
      question,
      transcript
    });
    return response.data;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};
