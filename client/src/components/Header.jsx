import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectCurrentUser, logout } from '../slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector(selectCurrentUser);

  const handleSignout = () => {
    dispatch(logout());
    navigate('/');
  };

  let links;

  if (authenticated) {
    links = (
      <>
        <LinkItem>
          <LinkText>{authenticated}</LinkText>
        </LinkItem>
        <LinkItem>
          <LinkText onClick={handleSignout}>Sign Out</LinkText>
        </LinkItem>
      </>
    );
  } else {
    links = (
      <>
        <LinkItem>
          <Link to="/signup">Sign Up</Link>
        </LinkItem>
        <LinkItem>
          <LinkText>Sign In</LinkText>
        </LinkItem>
      </>
    );
  }

  return (
    <HeaderContainer>
      <Logo>Taxonomize</Logo>
      <LinkList>{links}</LinkList>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  grid-column: 1 / end;
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.h2``;

const LinkList = styled.ul`
  list-style-type: none;
  display: flex;
`;

const LinkItem = styled.li``;

const LinkText = styled.a``;
