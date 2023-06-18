import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useSortPosts = posts => {
  const sortBy = useSelector(state => state.posts.sort);
  const [sortedPosts, setSortedPosts] = useState([]);

  const sortPostsByDate = useCallback(posts => {
    const sortedPosts = [...posts].sort((post1, post2) => {
      const date1 = new Date(post1.createdAt);
      const date2 = new Date(post2.createdAt);
      return date2 - date1;
    });

    return sortedPosts;
  }, []);

  const sortPostsByViews = useCallback(posts => {
    const sortedPosts = [...posts].sort((post1, post2) => {
      return post2.viewsCount - post1.viewsCount;
    });

    return sortedPosts;
  }, []);

  const sortPostsByDataOldest = useCallback(posts => {
    const sortedPosts = [...posts].sort((post1, post2) => {
      const date1 = new Date(post1.createdAt);
      const date2 = new Date(post2.createdAt);
      return date1 - date2;
    });

    return sortedPosts;
  }, []);

  useEffect(() => {
    if (posts && posts.length > 0) {
      let sortedPosts = [];

      switch (sortBy) {
        case 0:
          sortedPosts = sortPostsByDate(posts);
          break;
        case 1:
          sortedPosts = sortPostsByViews(posts);
          break;
        case 2:
          sortedPosts = sortPostsByDataOldest(posts);
          break;
        default:
          sortedPosts = sortPostsByDate(posts);
          break;
      }

      setSortedPosts(sortedPosts);
    }
  }, [posts, sortBy, sortPostsByDate, sortPostsByViews, sortPostsByDataOldest]);
  return sortedPosts;
};
