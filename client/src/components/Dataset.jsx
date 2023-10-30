import PropTypes from 'prop-types';
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
import Spinner from './Spinner';

const Dataset = ({ isDemo, dataInfo, demoData, setDemoData }) => {
  const user = useSelector(selectCurrentUser);
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedDataId = useSelector(selectSelectedDataId);
  const [selectedData, isSuccess, isLoading, isError] =
    apiSlice.endpoints.getData.useQueryState(
      { userId: user, taxonomyId: selectedTaxonomyId },
      {
        selectFromResult: ({ data, isSuccess, isLoading, isError }) => {
          const datasetToReturn = data?.find(
            (d) => d.dataset_id === parseInt(selectedDataId)
          );
          return [datasetToReturn, isSuccess, isLoading, isError];
        }
      }
    );

  if (isDemo) {
    return (
      <ContentContainer>
        <DataDetail data={dataInfo.nodes[0]} />
        <Observations
          taxonomyId={1}
          demoData={demoData}
          setDemoData={setDemoData}
        />
      </ContentContainer>
    );
  }

  if (isSuccess && selectedData) {
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
  if (isLoading) {
    return (
      <ContentContainer>
        <Spinner />
      </ContentContainer>
    );
  }
  if ((isError || !selectedData) && !isDemo) {
    return (
      <ContentContainer>There was an error loading this page</ContentContainer>
    );
  }
};

Dataset.propTypes = {
  demoData: PropTypes.object,
  isDemo: PropTypes.bool,
  dataInfo: PropTypes.object,
  setDemoData: PropTypes.func
};

export default Dataset;

const ContentContainer = styled.div`
  padding: 1rem;
  z-index: 1;
  display: grid;
  grid-template-row: 1fr 5fr;
  grid-template-column: 1fr 1fr;
  justify-items: start;
  max-width: 100%;
`;
