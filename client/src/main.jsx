import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import App from './App.jsx';
import Header from './components/Header';
import './index.css';
import store from './store/store';
import Main from './components/Main';
import SignupForm from './components/SignupForm.jsx';
import ModalComponent from './components/ModalComponent';

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider backgroundComponent={FadingBackground}>
        <Router>
          <App>
            <Header />
            <Routes>
              <Route exact path="/" element={<Main />} />
              <Route exact path="/signup" element={<SignupForm />} />
            </Routes>
            <ModalComponent />
          </App>
        </Router>
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
