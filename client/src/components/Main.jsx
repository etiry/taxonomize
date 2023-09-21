import styled from 'styled-components';
import NewTaxonomyForm from './NewTaxonomyForm';

const Main = () => (
  <Container>
    <NewTaxonomyForm />
  </Container>
);

export default Main;

const Container = styled.div`
  grid-column: 2 / end;
`;
