import styled from 'styled-components';
import { useState } from 'react';
import { useGetTaxonomiesQuery } from '../slices/apiSlice';

const SideNav = () => {
  const {
    data: taxonomies,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTaxonomiesQuery();
  const [showTaxonomies, setShowTaxonomies] = useState(true);

  const handleClick = () => {
    setShowTaxonomies(!showTaxonomies);
  };

  let content;

  if (isLoading) {
    content = (
      <div style={{ display: showTaxonomies ? 'block' : 'none' }}>
        Loading...
      </div>
    );
  } else if (isSuccess) {
    content = taxonomies.map((taxonomy) => (
      <LinkItem
        key={taxonomy._id}
        style={{ display: showTaxonomies ? 'block' : 'none' }}
      >
        <Link>{taxonomy.name}</Link>
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
          <Link onClick={handleClick}>My Taxonomies</Link>
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
