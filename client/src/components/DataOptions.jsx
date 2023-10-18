import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useGetDataByTaxonomyQuery } from '../slices/apiSlice';

const DataOptions = ({ selectedTaxonomyId }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetDataByTaxonomyQuery(selectedTaxonomyId);

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
  selectedTaxonomyId: PropTypes.string
};

export default DataOptions;

const Option = styled.option``;
