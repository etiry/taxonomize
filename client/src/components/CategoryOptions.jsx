import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useGetCategoriesQuery } from '../slices/apiSlice';

const CategoryOptions = ({ taxonomyId }) => {
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCategoriesQuery(taxonomyId);

  if (isSuccess) {
    return (
      <>
        {categories.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </>
    );
  }
};

CategoryOptions.propTypes = {
  taxonomyId: PropTypes.number
};

export default CategoryOptions;

const Option = styled.option``;
