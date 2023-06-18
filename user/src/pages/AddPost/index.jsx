import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { SelectIsAuth } from '../../redux/slices/auth';
import { fetchPost } from '../../redux/slices/postsSlice';
import { useHandleChangeImage } from '../../components/hooks/useHandleChangeImage';
import { useAddPost } from '../../components/hooks/useAddPost';
import { useEditPost } from '../../components/hooks/useEditPost';

export const AddPost = () => {
  const isAuth = useSelector(SelectIsAuth);
  const { item: post, status } = useSelector(state => state.posts.post);

  const dispatch = useDispatch();
  const { idPost } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const inputFileRef = useRef(null);

  const handleChangeImage = useHandleChangeImage(setImageUrl);
  const addPost = useAddPost();

  const editPost = useEditPost(idPost);
  const isEditing = Boolean(idPost);

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = value => {
    setText(value);
  };

  const onSubmit = isEditing
    ? () => editPost(title, imageUrl, tags, text)
    : () => addPost(title, imageUrl, tags, text);

  useEffect(() => {
    if (idPost) {
      dispatch(fetchPost(idPost));
      setTitle(post.title);
      setText(post.text);
      setImageUrl(post.imageUrl);
      setTags(post.tags.join(' '));
    }
  }, [dispatch, idPost]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        uniqueId: idPost ? idPost : 'new',
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type='file' onChange={handleChangeImage} hidden />
      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444/${imageUrl}`} alt='Uploaded' />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги'
        fullWidth
        onChange={e => setTags(e.target.value)}
        value={tags}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained'>
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <Link to='/'>
          <Button size='large'>Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
