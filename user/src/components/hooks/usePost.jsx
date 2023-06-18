import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost } from '../../redux/slices/postsSlice';

const usePost = postId => {
  const { item, status } = useSelector(state => state.posts.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPost(postId));
  }, [dispatch, postId]);

  return { post: item, status };
};

export default usePost;
