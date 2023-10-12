import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import DataDetail from './DataDetail';
import Observations from './Observations';
import TableOptions from './TableOptions';
import {
  selectSelectedDataId,
  selectSelectedTaxonomyId
} from '../slices/selectionsSlice';
import Datasets from './Datasets';
import Team from './Team';

const Content = ({ contentType }) => {
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

  let content;

  if (contentType === 'dashboard') {
    return <ContentContainer>This is the content</ContentContainer>;
  }
  if (contentType === 'team') {
    return (
      <ContentContainer>
        <Team />
      </ContentContainer>
    );
  }
  if (contentType === 'allDatasets') {
    return (
      <ContentContainer>
        All Datasets
        <Datasets />
      </ContentContainer>
    );
  }
  if (contentType === 'dataDetail') {
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
  }
  if (contentType === 'compareDatasets') {
    return <ContentContainer>Compare Datasets</ContentContainer>;
  }

  return content;
};

Content.propTypes = {
  contentType: PropTypes.string
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
