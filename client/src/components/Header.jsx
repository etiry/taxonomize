import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCurrentUser,
  selectCurrentUserEmail,
  selectCurrentUserTeam,
  logout
} from '../slices/authSlice';
import { useGetTaxonomiesQuery } from '../slices/apiSlice';
import { setIsOpen, setSelectedTaxonomyId } from '../slices/selectionsSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector(selectCurrentUser);
  const email = useSelector(selectCurrentUserEmail);
  const { name: teamName } = useSelector(selectCurrentUserTeam);

  const {
    data: taxonomies,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTaxonomiesQuery(authenticated);

  const handleSignout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleChangeTaxonomy = (event) => {
    dispatch(setSelectedTaxonomyId(event.target.value));
  };

  const toggleModal = () => {
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
          {teamName}
        </LinkItem>
        <LinkItem>
          <LinkText>{email}</LinkText>
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
`;

const Logo = styled.h2``;

const LinkList = styled.ul`
  list-style-type: none;
  display: flex;
`;

const LinkItem = styled.li``;

const LinkText = styled.a``;

const Label = styled.span`
  font-weight: bold;
`;

const Button = styled.button``;

const Select = styled.select``;

const Option = styled.option``;
