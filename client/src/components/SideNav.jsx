import styled from 'styled-components';

const SideNav = () => (
  <Nav>
    <Button>+ New Taxonomy</Button>
    <LinkList>
      <LinkItem>
        <Link>Dashboard</Link>
      </LinkItem>
      <LinkItem>
        <Link>Taxonomies</Link>
      </LinkItem>
      <LinkItem>
        <Link>Data</Link>
      </LinkItem>
    </LinkList>
  </Nav>
);

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
