import { useDispatch } from 'react-redux';
import { fetchPatchPost } from '../../redux/slices/postsSlice';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useEditPost = idPost => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editPost = useCallback(
    async (title, imageUrl, tags, text) => {
      try {
        const fields = {
          title,
          imageUrl,
          tags: tags.split(','),
          text,
        };

        await dispatch(fetchPatchPost({ id: idPost, fields }));

        navigate(`/posts/${idPost}`);
      } catch (error) {
        console.warn('ERROR NOT EDITED POST');
        alert('ERROR');
      }
    },
    [dispatch, idPost, navigate],
  );

  return editPost;
};
