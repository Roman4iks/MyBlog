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
  const dispatch = useDispatch();
  const { idPost } = useParams();
  const inputFileRef = useRef(null);

  const isAuth = useSelector(SelectIsAuth);
  const { post } = useSelector(state => state.posts);

  const [imageUrl, setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const handleChangeImage = useHandleChangeImage(setImageUrl);

  const addPost = useAddPost();
  const editPost = useEditPost(idPost);

  const isTitleEmpty = title.trim() === '';
  const isTextEmpty = text.trim() === '';
  const isFormEmpty = title.trim() === '' || text.trim() === '';
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
    } else {
      setTitle('');
      setText('');
      setImageUrl('');
      setTags('');
    }
  }, [dispatch, idPost]);

  useEffect(() => {
    if (post.item && isEditing) {
      setTitle(post.item.title);
      setText(post.item.text);
      setImageUrl(post.item.imageUrl);
      setTags(post.item.tags ? post.item.tags.join(' ') : '');
    }
  }, [post.item, isEditing]);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Typing text...',
      status: false,
      autosave: {
        uniqueId: idPost ? idPost : 'new',
        enabled: true,
        delay: 1000,
      },
    }),
    [idPost],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />;
  }
  if (post.status === 'loading' && post.item) {
    return <div>Loading...</div>;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Load preview
      </Button>
      <input ref={inputFileRef} type='file' onChange={handleChangeImage} hidden />
      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:4444/${imageUrl}`} alt='Uploaded' />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Header post'
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={isTitleEmpty}
        helperText={isTitleEmpty && 'Please enter a title'}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Tags'
        fullWidth
        onChange={e => setTags(e.target.value)}
        value={tags}
      />
      <SimpleMDE
        className={`${styles.editor} ${isTextEmpty ? styles.emptyEditor : ''}`}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained' disabled={isFormEmpty}>
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <Link to='/'>
          <Button size='large'>Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
