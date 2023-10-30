import styled from 'styled-components';

const Dashboard = () => (
  <ContentContainer>
    <Heading>Dashboard</Heading>
  </ContentContainer>
);

export default Dashboard;

const ContentContainer = styled.main`
  grid-column: 2 / end;
  grid-row: 2 / end;
  padding: 1rem;
  z-index: 1;
  width: 100%;
`;

const Heading = styled.h3``;
