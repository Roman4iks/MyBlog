import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';

import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthMe } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth='lg'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts/:id' element={<FullPost />} />
          <Route path='/posts/:idPost/edit' element={<AddPost />} />
          <Route path='/tags/:tag' element={<Home />} />
          <Route path='/add-post' element={<AddPost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
