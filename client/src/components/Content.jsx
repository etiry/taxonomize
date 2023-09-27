import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentData } from '../slices/dataSlice';
import DataDetail from './DataDetail';
import Observations from './Observations';

const Content = () => {
  const { id } = useSelector(selectCurrentData);
  const data = useSelector(selectCurrentData);

  if (id) {
    return (
      <ContentContainer>
        <DataDetail data={data} />;
        <Observations
          observations={data.observations}
          taxonomyId={data.taxonomy.id}
        />
      </ContentContainer>
    );
  }

  return <ContentContainer>This is the content</ContentContainer>;
};

export default Content;

const ContentContainer = styled.header`
  grid-column: 2 / end;
  display: grid;
  grid-template-row: 1fr 4fr;
  justify-items: center;
  max-width: 100%;
`;
