import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetDataQuery,
  useLazyGetObservationsQuery
} from '../slices/apiSlice';
import { selectCurrentUser } from '../slices/authSlice';

const SideNav = ({ setSelectedDataId }) => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isSuccess, isError, error } = useGetDataQuery(user);
  const [getObs] = useLazyGetObservationsQuery();
  const [showData, setShowData] = useState(true);

  const handleClick = () => {
    setShowData(!showData);
  };

  const handleSelectData = async (dataId) => {
    const params = { dataId, page: 1 };
    await getObs(params);
    setSelectedDataId(dataId);
  };

  let content;

  if (isLoading) {
    content = (
      <div style={{ display: showData ? 'block' : 'none' }}>Loading...</div>
    );
  } else if (isSuccess) {
    content = data.map((d) => (
      <LinkItem
        key={d.id}
        style={{ display: showData ? 'block' : 'none' }}
        onClick={() => handleSelectData(d.id)}
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

SideNav.propTypes = {
  setSelectedDataId: PropTypes.func
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
