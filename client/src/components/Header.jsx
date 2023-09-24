import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiSlice } from '../slices/apiSlice';
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
      <LinkItem>
        <Link onClick={handleSignout}>Sign Out</Link>
      </LinkItem>
    );
  } else {
    links = (
      <>
        <LinkItem>
          <Link>Sign Up</Link>
        </LinkItem>
        <LinkItem>
          <Link>Sign In</Link>
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

const Link = styled.a``;
