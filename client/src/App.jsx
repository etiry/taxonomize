import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './slices/authSlice';
import Header from './components/Header';
import SideNav from './components/SideNav';
import Dashboard from './components/Dashboard';
import SignupForm from './components/SignupForm.jsx';
import ModalComponent from './components/ModalComponent';
import Datasets from './components/Datasets';
import SigninForm from './components/SigninForm';
import Team from './components/Team';
import Dataset from './components/Dataset';
import Compare from './components/Compare';
import Demo from './components/Demo';

const App = () => {
  const authenticated = useSelector(selectCurrentUser);

  if (!authenticated) {
    return (
      <Router>
        <SigninContainer>
          <Header />
          <Routes>
            <Route exact path="/" element={<SigninForm />} />
            <Route exact path="/signup" element={<SignupForm />} />
            <Route exact path="/demo" element={<Demo />} />
          </Routes>
          <ModalComponent />
        </SigninContainer>
      </Router>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Header />
        <SideNav />
        <ContentContainer>
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/team" element={<Team />} />
            <Route exact path="/datasets" element={<Datasets />} />
            <Route exact path="/dataset/:id" element={<Dataset />} />
            <Route exact path="/compare" element={<Compare />} />
          </Routes>
        </ContentContainer>
        <ModalComponent />
      </AppContainer>
    </Router>
  );
};

export default App;

const AppContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 140px 1fr;
  grid-template-columns: 1fr 5fr;
  background: #f5f5f5;
`;

const ContentContainer = styled.div`
  background: #f5f5f5;
  grid-row: 2;
  grid-column: 2;
`;

const SigninContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 5fr;
  background: #f5f5f5;
`;
