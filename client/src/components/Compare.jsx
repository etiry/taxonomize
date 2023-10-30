import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  selectSelectedTaxonomyId,
  selectSelectedDataId
} from '../slices/selectionsSlice';
import CompareDataDetail from './CompareDataDetail';
import TableOptions from './TableOptions';
import CompareDatasets from './CompareDatasets';

const Compare = ({ isDemo, dataInfo, demoData, setDemoData }) => {
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedDataId = useSelector(selectSelectedDataId);

  if (isDemo) {
    return (
      <ContentContainer>
        <CompareDataDetail
          selectedTaxonomyId={1}
          isDemo={isDemo}
          dataInfo={dataInfo}
          demoData={demoData}
        />
        <TableOptions selectedDataId={1} taxonomyId={1} />
        <CompareDatasets taxonomyId={1} isDemo={isDemo} demoData={demoData} />
      </ContentContainer>
    );
  }

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

Compare.propTypes = {
  dataInfo: PropTypes.object,
  demoData: PropTypes.object,
  isDemo: PropTypes.bool,
  setDemoData: PropTypes.func
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
