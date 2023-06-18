import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostsTags, setSort } from '../../redux/slices/postsSlice';
import { useSortPosts } from './useSortPosts';

const useHome = () => {
  const dispatch = useDispatch();
  const { posts, tags, filter } = useSelector(state => state.posts);
  const sortBy = useSelector(state => state.posts.sort);
  const userData = useSelector(state => state.auth.data);
  const sortedPosts = useSortPosts(posts.items);

  const filterPosts = useMemo(() => {
    if (!filter.tag) {
      return sortedPosts;
    }
    return sortedPosts.filter(post => post.tags.includes(filter.tag));
  }, [sortedPosts, filter]);

  useLayoutEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPostsTags());
  }, [dispatch]);

  useLayoutEffect(() => {
    dispatch(setSort(sortBy));
  }, [dispatch, sortBy]);

  return {
    posts,
    tags,
    sortBy,
    userData,
    filterPosts,
  };
};

export default useHome;
