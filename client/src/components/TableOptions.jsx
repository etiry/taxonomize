import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useLazyGetObservationsQuery } from '../slices/apiSlice';
import { selectGetObsParams, setGetObsParams } from '../slices/paramsSlice';
import CategoryOptions from './CategoryOptions';

const TableOptions = ({ selectedDataId, taxonomyId }) => {
  const dispatch = useDispatch();
  const {
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const [getObs] = useLazyGetObservationsQuery();

  const handleSearch = async (event) => {
    dispatch(
      setGetObsParams({
        page: 1,
        dataId: selectedDataId,
        query: event.target.form[0].value,
        sort: event.target.form[1].value,
        filter: event.target.form[2].value
      })
    );
    const params = {
      page: 1,
      dataId: selectedDataId,
      query: event.target.form[0].value,
      sort: event.target.form[1].value,
      filter: event.target.form[2].value
    };
    await getObs(params);
  };

  return (
    <Form>
      <FormGroup>
        <FormLabel>Search Text: </FormLabel>
        <FormInput
          type="text"
          id="searchTerm"
          {...register('searchTerm')}
          onChange={handleSearch}
        />
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
  selectedDataId: PropTypes.number,
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
