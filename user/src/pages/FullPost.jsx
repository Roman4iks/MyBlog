import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import usePost from '../components/hooks/usePost';

export const FullPost = () => {
  const { id } = useParams();
  const { post, status } = usePost(id);

  if (status === 'loading') {
    return <Post isLoading={true} isFullPost />;
  }

  if (status === 'error') {
    return (
      <div>
        <h1>ERROR</h1>
      </div>
    );
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl ? `http://localhost:4444/${post.imageUrl}` : ''}
        user={post.user}
        createdAt={post.createAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Это тестовый комментарий 555555',
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
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
