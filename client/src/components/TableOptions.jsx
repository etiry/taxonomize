import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { apiSlice } from '../slices/apiSlice';
import CategoryOptions from './CategoryOptions';

const TableOptions = ({ taxonomyId }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const categories = apiSlice.endpoints.getCategories.useQueryState(taxonomyId);

  const onSubmit = async (data) => {
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <FormLabel>Search Text: </FormLabel>
        <FormInput type="text" {...register('searchTerm')} />
      </FormGroup>
      <FormGroup>
        <FormLabel>Sort by: </FormLabel>
        <Select {...register('sort')}>
          <Option value="">None</Option>
          <Option value="textAsc">Text: Ascending</Option>
          <Option value="textDesc">Text: Descending</Option>
          <Option value="categoryAsc">Category: Ascending</Option>
          <Option value="categoryDesc">Category: Descending</Option>
        </Select>
      </FormGroup>
      <FormGroup>
        <FormLabel>Filter by: </FormLabel>
        <Select {...register('filter')}>
          <Option value="">None</Option>
          <CategoryOptions taxonomyId={taxonomyId} />
        </Select>
      </FormGroup>
    </Form>
  );
};

TableOptions.propTypes = {
  taxonomyId: PropTypes.number
};

export default TableOptions;

const Form = styled.form`
  grid-row: 1;
  grid-column: 2;
`;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Select = styled.select``;
const Option = styled.option``;
const Button = styled.button``;
