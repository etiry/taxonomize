import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedDataId,
  selectSelectedDataId,
  setComparedUsers
} from '../slices/selectionsSlice';
import {
  apiSlice,
  useLazyGetObservationsQuery,
  useLazyGetUserAssignedCategoriesQuery
} from '../slices/apiSlice';
import UserOptions from './UserOptions';
import DataOptions from './DataOptions';

const CompareDataDetail = ({ selectedTaxonomyId }) => {
  const dispatch = useDispatch();
  const [getObs] = useLazyGetObservationsQuery();
  const [getUserAssignedCategories] = useLazyGetUserAssignedCategoriesQuery();
  const {
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const selectedDataId = useSelector(selectSelectedDataId);

  const { data } = apiSlice.endpoints.getObservations.useQueryState({
    dataId: selectedDataId,
    page: 1,
    query: '',
    sort: '',
    filter: ''
  });

  const handleInputChange = async (event, type) => {
    if (type === 'data') {
      await dispatch(setSelectedDataId(parseInt(event.target.value)));
      await getObs({
        dataId: parseInt(event.target.value),
        page: 1,
        query: '',
        sort: '',
        filter: ''
      });
    } else {
      dispatch(
        setComparedUsers({
          user1: event.target.form[1].value,
          user2: event.target.form[2].value
        })
      );
      const params = {
        userId: event.target.value,
        obIds: data.nodes.map((ob) => ob.id)
      };
      await getUserAssignedCategories(params);
    }
  };

  return (
    <Container>
      <Form>
        <FormGroup>
          <FormLabel>Dataset: </FormLabel>
          <Select
            {...register('data')}
            onChange={(event) => handleInputChange(event, 'data')}
          >
            <Option value="">None</Option>
            <DataOptions selectedTaxonomyId={selectedTaxonomyId} />
          </Select>
        </FormGroup>
        <FormGroup>
          <FormLabel>User 1: </FormLabel>
          <Select
            {...register('user1')}
            onChange={(event) => handleInputChange(event, 'user')}
          >
            <Option value="">None</Option>
            <UserOptions dataId={selectedDataId} />
          </Select>
        </FormGroup>
        <FormGroup>
          <FormLabel>User 2: </FormLabel>
          <Select
            {...register('user2')}
            onChange={(event) => handleInputChange(event, 'user')}
          >
            <Option value="">None</Option>
            <UserOptions dataId={selectedDataId} />
          </Select>
        </FormGroup>
        <Button>Calculate Agreement Statistics</Button>
      </Form>
    </Container>
  );
};

CompareDataDetail.propTypes = {
  selectedTaxonomyId: PropTypes.string
};

export default CompareDataDetail;

const Container = styled.div`
  grid-row: 1;
  grid-column: 1;
`;

const Form = styled.form``;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Select = styled.select``;
const Option = styled.option``;
const Button = styled.button``;
