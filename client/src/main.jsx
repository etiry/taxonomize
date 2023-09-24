import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Header from './components/Header';
import './index.css';
import store from './store/store';
import Main from './components/Main';
import SignupForm from './components/SignupForm.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Header />
        <App>
          <Routes>
            <Route exact path="/" element={<Main />} />
            <Route exact path="/signup" element={<SignupForm />} />
          </Routes>
        </App>
      </Router>
      <App />
    </Provider>
  </React.StrictMode>
);
