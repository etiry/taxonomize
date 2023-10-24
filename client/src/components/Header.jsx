import styled from 'styled-components';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCurrentUser,
  selectCurrentUserEmail,
  selectCurrentUserTeam,
  logout
} from '../slices/authSlice';
import {
  useGetTaxonomiesQuery,
  useLazyGetTaxonomyUsersQuery
} from '../slices/apiSlice';
import {
  setIsOpen,
  setSelectedTaxonomyId,
  setFormType
} from '../slices/selectionsSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector(selectCurrentUser);
  const email = useSelector(selectCurrentUserEmail);
  const team = useSelector(selectCurrentUserTeam);

  const {
    data: taxonomies,
    isSuccess,
    isLoading
  } = useGetTaxonomiesQuery(authenticated);
  const [getTaxonomyUsers] = useLazyGetTaxonomyUsersQuery();

  const handleSignout = () => {
    localStorage.removeItem('taxonomizeId');
    localStorage.removeItem('taxonomizeEmail');
    localStorage.removeItem('taxonomizeToken');
    localStorage.removeItem('taxonomizeTeam');
    dispatch(logout());
    navigate('/');
  };

  const handleChangeTaxonomy = (event) => {
    dispatch(setSelectedTaxonomyId(event.target.value));
    getTaxonomyUsers(event.target.value);
  };

  const toggleModal = () => {
    dispatch(setFormType({ entity: 'Taxonomy', new: true }));
    dispatch(setIsOpen());
  };

  let links;

  if (authenticated && isSuccess) {
    links = (
      <>
        <LinkItem>
          <Button onClick={toggleModal}>Add a Taxonomy</Button>
        </LinkItem>
        <LinkItem>
          <Label>Current Taxonomy: </Label>
          <Select onChange={handleChangeTaxonomy}>
            <Option value="">Select a taxonomy</Option>
            {taxonomies.map((taxonomy) => (
              <Option key={taxonomy.id} value={taxonomy.id}>
                {taxonomy.name}
              </Option>
            ))}
          </Select>
        </LinkItem>
        <LinkItem>
          <Label>Team: </Label>
          {team.name || 'None'}
        </LinkItem>
        <LinkItem>
          <LinkText>{email}</LinkText>
        </LinkItem>
        <LinkItem>
          <LinkText onClick={handleSignout}>Sign Out</LinkText>
        </LinkItem>
      </>
    );
  } else if (authenticated && isLoading) {
    links = 'Loading...';
  } else {
    links = (
      <>
        <LinkItem>
          <Link to="/signup">Sign Up</Link>
        </LinkItem>
        <LinkItem>
          <Link to="/">Sign In</Link>
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
  align-content: center;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff;
  z-index: 5;
  width: 100%;
`;

const Logo = styled.h1`
  font-family: 'Staatliches', sans-serif;
  font-weight: 500;
`;

const LinkList = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
`;

const LinkItem = styled.li`
  padding: 1rem;
`;

const LinkText = styled.a`
  cursor: pointer;
`;

const Label = styled.span`
  font-weight: 500;
`;

const Button = styled.button``;

const Select = styled.select`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
`;

const Option = styled.option``;
