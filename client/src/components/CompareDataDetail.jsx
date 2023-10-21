import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedDataId,
  selectSelectedDataId,
  setComparedUsers,
  selectComparedUsers
} from '../slices/selectionsSlice';
import {
  apiSlice,
  useLazyGetObservationsQuery,
  useLazyGetUserAssignedCategoriesQuery
} from '../slices/apiSlice';
import UserOptions from './UserOptions';
import DataOptions from './DataOptions';
import ToggleSwitch from './ToggleSwitch';
import AgreementStatistics from './AgreementStatistics';

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
  const [toggleValue, setToggleValue] = useState(false);

  const handleToggle = async () => {
    setToggleValue(!toggleValue);
  };

  const handleInputChange = async (event, type) => {
    if (type === 'data') {
      await dispatch(setSelectedDataId(parseInt(event.target.value)));
    } else {
      dispatch(
        setComparedUsers({
          user1: event.target.form[1].value,
          user2: event.target.form[2].value
        })
      );
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
        <FormGroup>
          <FormLabel>
            Show Agreement Statistics:{' '}
            <ToggleSwitch isOn={toggleValue} handleToggle={handleToggle} />
          </FormLabel>
        </FormGroup>
      </Form>
      <InfoBox style={{ display: toggleValue ? 'block' : 'none' }}>
        <AgreementStatistics />
      </InfoBox>
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
const FormGroup = styled.div`
  padding: 0.2rem;
`;
const FormLabel = styled.label`
  font-weight: 500;
`;
const Select = styled.select`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
`;
const Option = styled.option``;
const InfoBox = styled.div``;
