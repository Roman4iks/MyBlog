import axios from '../../axios';
import { useCallback } from 'react';

export const useHandleChangeImage = setImageUrl => {
  const handleChangeFile = useCallback(
    async event => {
      try {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        const { data } = await axios.post('/upload', formData);
        setImageUrl(data.url);
      } catch (error) {
        console.warn('Error upload file', error);
        alert('ERROR UPLOAD FILE');
      }
    },
    [setImageUrl],
  );

  return handleChangeFile;
};
