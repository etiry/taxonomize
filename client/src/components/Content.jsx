import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import DataDetail from './DataDetail';
import Observations from './Observations';
import TableOptions from './TableOptions';
import { selectSelectedDataId } from '../slices/selectionsSlice';

const Content = () => {
  const user = useSelector(selectCurrentUser);
  const selectedDataId = useSelector(selectSelectedDataId);
  const selectedData = apiSlice.endpoints.getData.useQueryState(user, {
    selectFromResult: ({ data }) => data?.find((d) => d.id === selectedDataId)
  });

  if (selectedData) {
    return (
      <ContentContainer>
        <DataDetail data={selectedData} />
        <TableOptions
          selectedDataId={selectedDataId}
          taxonomyId={selectedData.taxonomy_id}
        />
        <Observations
          selectedDataId={selectedDataId}
          taxonomyId={selectedData.taxonomy_id}
          datasetAssignmentId={selectedData.id}
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
  grid-template-row: 1fr 5fr;
  grid-template-column: 1fr 1fr;
  justify-items: start;
  max-width: 100%;
`;
