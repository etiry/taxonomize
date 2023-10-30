import styled from 'styled-components';

const Dashboard = () => (
  <ContentContainer>
    <Heading>Dashboard</Heading>
  </ContentContainer>
);

export default Dashboard;

const ContentContainer = styled.main`
  padding: 1rem;
  z-index: 1;
  width: 100%;
`;

const Heading = styled.h3``;
