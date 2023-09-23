import styled from 'styled-components';

const Content = () => <ContentContainer>This is the content</ContentContainer>;

export default Content;

const ContentContainer = styled.header`
  grid-column: 2 / end;
`;
