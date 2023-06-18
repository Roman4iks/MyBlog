import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAddPost } from '../../redux/slices/postsSlice';

export const useAddPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addPost = useCallback(
    async (title, imageUrl, tags, text) => {
      try {
        const fields = {
          title,
          imageUrl,
          tags: tags.split(','),
          text,
        };

        const data = dispatch(fetchAddPost(fields));
        data
          .then(post => {
            navigate(`/posts/${post.payload._id}`);
          })
          .catch(error => {
            alert('ERROR');
            console.log(error);
          });
      } catch (error) {
        console.warn('ERROR NOT CREATED POST', error);
        alert('ERROR');
      }
    },
    [dispatch, navigate],
  );

  return addPost;
};
