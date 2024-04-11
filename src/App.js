import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from "./Redux/store";
import AuthContextProvider from './AuthContextProvider';
import Register from './Components/Register';
import Main from './Components/Main';
import Login from './Components/Login';
import { setCurrentUser } from './Redux/Slicefiles/AuthenticSlice'
import './style.scss'

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    console.log("Current user:", currentUser);
  }, [currentUser]);

  const ProtectedRoute = ({ children }) => {
    return currentUser === null ? <Navigate to="/login" /> : children;
  };

  return (
    <Provider store={store}>
      <AuthContextProvider>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>

              } />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
