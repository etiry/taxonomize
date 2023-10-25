import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { apiSlice } from '../slices/apiSlice';
import { selectCurrentUser } from '../slices/authSlice';
import {
  selectSelectedTaxonomyId,
  selectSelectedDataId
} from '../slices/selectionsSlice';
import DataDetail from './DataDetail';
import TableOptions from './TableOptions';
import Observations from './Observations';

const Dataset = () => {
  const user = useSelector(selectCurrentUser);
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedDataId = useSelector(selectSelectedDataId);
  const selectedData = apiSlice.endpoints.getData.useQueryState(
    { userId: user, taxonomyId: selectedTaxonomyId },
    {
      selectFromResult: ({ data }) =>
        data?.find((d) => d.dataset_id === selectedDataId)
    }
  );

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
};

export default Dataset;

const ContentContainer = styled.div`
  grid-column: 2 / end;
  grid-row: 2 / end;
  padding: 1rem;
  z-index: 1;
  display: grid;
  grid-template-row: 1fr 5fr;
  grid-template-column: 1fr 1fr;
  justify-items: start;
  max-width: 100%;
`;