import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentData } from '../slices/dataSlice';
import DataDetail from './DataDetail';

const Content = () => {
  const data = useSelector(selectCurrentData);

  if (data) {
    return (
      <ContentContainer>
        <DataDetail data={data} />;
      </ContentContainer>
    );
  }

  return <ContentContainer>This is the content</ContentContainer>;
};

export default Content;

const ContentContainer = styled.header`
  grid-column: 2 / end;
`;
