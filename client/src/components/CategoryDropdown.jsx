import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useAssignCategoryMutation } from '../slices/apiSlice';

const CategoryDropdown = ({ categories, observationId }) => {
  const [assignCategory] = useAssignCategoryMutation();

  const handleChange = async (event) => {
    const queryParams = { observationId, categoryId: event.target.value };
    try {
      await assignCategory(queryParams);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  return (
    <Dropdown name="categories" id="categories" onChange={handleChange}>
      <Option value="">--Please choose a category--</Option>
      {categories.map((category) => (
        <Option key={category._id} value={category._id}>
          {category.name}
        </Option>
      ))}
    </Dropdown>
  );
};

CategoryDropdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  observationId: PropTypes.string
};

export default CategoryDropdown;

const Dropdown = styled.select``;

const Option = styled.option``;
