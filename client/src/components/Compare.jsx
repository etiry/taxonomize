import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  selectSelectedTaxonomyId,
  selectSelectedDataId
} from '../slices/selectionsSlice';
import CompareDataDetail from './CompareDataDetail';
import TableOptions from './TableOptions';
import CompareDatasets from './CompareDatasets';

const Compare = () => {
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedDataId = useSelector(selectSelectedDataId);

  return (
    <ContentContainer>
      <CompareDataDetail selectedTaxonomyId={selectedTaxonomyId} />
      <TableOptions
        selectedDataId={selectedDataId}
        taxonomyId={parseInt(selectedTaxonomyId)}
      />
      <CompareDatasets taxonomyId={parseInt(selectedTaxonomyId)} />
    </ContentContainer>
  );
};

export default Compare;

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
