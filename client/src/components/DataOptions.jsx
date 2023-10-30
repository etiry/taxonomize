import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useGetDataByTaxonomyQuery } from '../slices/apiSlice';

const DataOptions = ({ selectedTaxonomyId, isDemo, dataInfo }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetDataByTaxonomyQuery(selectedTaxonomyId);

  if (isDemo) {
    return (
      <>
        {dataInfo.nodes.map((dataset) => (
          <Option key={dataset.id} value={dataset.id}>
            {dataset.dataset_name}
          </Option>
        ))}
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        {data.nodes.map((dataset) => (
          <Option key={dataset.id} value={dataset.id}>
            {dataset.name}
          </Option>
        ))}
      </>
    );
  }
};

DataOptions.propTypes = {
  dataInfo: PropTypes.object,
  isDemo: PropTypes.bool,
  selectedTaxonomyId: PropTypes.number
};

export default DataOptions;

const Option = styled.option``;
