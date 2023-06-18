import axios from '../../axios';
import { useCallback } from 'react';

export const useOnSubmit = (isEditing, idPost, title, imageUrl, tags, text, navigate) => {
  const onSubmit = useCallback(async () => {
    try {
      const fields = {
        title,
        imageUrl,
        tags: tags.split(','),
        text,
      };

      const { data } = !isEditing
        ? await axios.post('/posts', fields)
        : await axios.patch(`/posts/${idPost}`, fields);

      const id = isEditing ? idPost : data._id;

      navigate(`/posts/${id}`);
    } catch (error) {
      console.warn('ERROR NOT CREATED POST');
      alert('ERROR');
    }
  }, [isEditing, idPost, title, imageUrl, tags, text, navigate]);

  return onSubmit;
};
