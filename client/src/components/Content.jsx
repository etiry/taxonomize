import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentData } from '../slices/dataSlice';
import DataDetail from './DataDetail';

const Content = () => {
  const { id } = useSelector(selectCurrentData);
  const data = useSelector(selectCurrentData);

  if (id) {
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
