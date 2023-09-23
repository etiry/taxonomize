import styled from 'styled-components';
import { useSelector } from 'react-redux';
import SideNav from './SideNav';
import Content from './Content';
import SigninForm from './SigninForm';
import { selectCurrentUser } from '../slices/authSlice';

const Main = () => {
  const authenticated = useSelector(selectCurrentUser);

  if (authenticated) {
    return (
      <ContentContainer>
        <SideNav />
        <Content />
      </ContentContainer>
    );
  }

  return (
    <SigninContainer>
      <SigninForm />
    </SigninContainer>
  );
};

export default Main;

const ContentContainer = styled.main`
  display: grid;
  grid-template-columns: 1fr 5fr;
`;

const SigninContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;
