import styled from 'styled-components';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetDataQuery } from '../slices/apiSlice';
import { selectCurrentUser } from '../slices/authSlice';
import { setCurrentData } from '../slices/dataSlice';

const SideNav = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isSuccess, isError, error } = useGetDataQuery(user);
  const [showData, setShowData] = useState(true);

  const handleClick = () => {
    setShowData(!showData);
  };

  const handleSelectData = (selectedData) => {
    dispatch(setCurrentData(selectedData));
  };

  let content;

  if (isLoading) {
    content = (
      <div style={{ display: showData ? 'block' : 'none' }}>Loading...</div>
    );
  } else if (isSuccess) {
    content = data.map((d) => (
      <LinkItem
        key={d._id}
        style={{ display: showData ? 'block' : 'none' }}
        onClick={() => handleSelectData(d)}
      >
        <Link>{d.name}</Link>
      </LinkItem>
    ));
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <Nav>
      <Button>+ New Taxonomy</Button>
      <LinkList>
        <LinkItem>
          <Link>Dashboard</Link>
        </LinkItem>
        <LinkItem>
          <Link onClick={handleClick}>My Data</Link>
        </LinkItem>
        {content}
      </LinkList>
    </Nav>
  );
};

export default SideNav;

const Nav = styled.nav`
  min-height: 100vh;
  grid-column: 1;
`;

const Button = styled.button``;

const LinkList = styled.ul`
  list-style-type: none;
`;

const LinkItem = styled.li``;

const Link = styled.a``;
