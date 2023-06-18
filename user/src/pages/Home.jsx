import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import useHome from '../components/hooks/useHome';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSort, setTag } from '../redux/slices/postsSlice';

export const Home = () => {
  const { sortBy, posts, filterPosts, userData, tags } = useHome();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSortChange = (event, value) => {
    dispatch(setSort(value));
    dispatch(setTag(null));
    navigate('/');
  };

  const handleTagChange = value => {
    dispatch(setTag(value));
    navigate(`/tags/${value}`);
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={sortBy}
        onChange={handleSortChange}
        aria-label='basic tabs example'
      >
        <Tab value={0} label='Новые' />
        <Tab value={1} label='Популярные' />
        <Tab value={2} label='Старые' />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(posts.status === 'loading' ? [...Array(5)] : filterPosts).map((post, index) => (
            <Post
              key={post ? post._id : index}
              isLoading={posts.status === 'loading'}
              id={post?._id}
              title={post?.title}
              imageUrl={post?.imageUrl ? `http://localhost:4444/${post.imageUrl}` : ''}
              user={post?.user}
              createdAt={post?.createdAt}
              viewsCount={post?.viewsCount}
              commentsCount={3}
              tags={post?.tags}
              isEditable={userData?._id === post?.user?._id}
              onChangeTag={handleTagChange}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            onChangeTag={handleTagChange}
            items={tags.items}
            isLoading={tags.status === 'loading' ? true : false}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пушкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
