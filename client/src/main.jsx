import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import App from './App.jsx';
import './index.css';
import store from './store/store';

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider backgroundComponent={FadingBackground}>
        <App />
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
