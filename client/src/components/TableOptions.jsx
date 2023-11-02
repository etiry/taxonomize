import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import debounce from 'debounce';
import { useLazyGetObservationsQuery } from '../slices/apiSlice';
import { selectGetObsParams, setGetObsParams } from '../slices/paramsSlice';
import { selectCurrentUser } from '../slices/authSlice';
import CategoryOptions from './CategoryOptions';
import Switch from './ToggleSwitch';

const TableOptions = ({ selectedDataId, taxonomyId, isCompare }) => {
  const dispatch = useDispatch();
  const {
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const [getObs] = useLazyGetObservationsQuery();
  const userId = useSelector(selectCurrentUser);
  const [toggleValue, setToggleValue] = useState(false);

  const handleToggle = async (event) => {
    setToggleValue(!toggleValue);
    handleInputChange(event);
  };

  const handleInputChange = async (event) => {
    dispatch(
      setGetObsParams({
        page: 1,
        dataId: selectedDataId,
        userIds: userId,
        query: event.target.form[0].value,
        sort: event.target.form[1].value,
        filter: [event.target.form[2].value, event.target.form[3].value],
        differentOnly: event.target.form[4]?.checked || false
      })
    );
    const params = {
      page: 1,
      dataId: selectedDataId,
      userIds: userId,
      query: event.target.form[0].value,
      sort: event.target.form[1].value,
      filter: [event.target.form[2].value, event.target.form[3].value],
      differentOnly: event.target.form[4]?.checked || false
    };
    await getObs(params);
  };

  const handleReset = async (event) => {
    event.preventDefault();
    reset();
    dispatch(
      setGetObsParams({
        page: 1,
        dataId: selectedDataId,
        userIds: userId,
        query: null,
        sort: null,
        filter: []
      })
    );
    const params = {
      page: 1,
      dataId: selectedDataId,
      userIds: userId,
      query: null,
      sort: null,
      filter: []
    };
    await getObs(params);
  };

  return (
    <Form>
      <FormGroup>
        <FormLabel>Search text: </FormLabel>
        <FormInput
          type="text"
          id="searchTerm"
          {...register('searchTerm')}
          onChange={debounce((event) => handleInputChange(event), 500)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Sort by: </FormLabel>
        <Select {...register('sort')} onChange={handleInputChange}>
          <Option value="">None</Option>
          <Option value="text_Asc">Text: Ascending</Option>
          <Option value="text_Desc">Text: Descending</Option>
          <Option value="category1_Asc">
            {isCompare ? 'User 1 Category: Ascending' : 'Category: Ascending'}
          </Option>
          <Option value="category1_Desc">
            {isCompare ? 'User 1 Category: Descending' : 'Category: Descending'}
          </Option>
          {isCompare ? (
            <Option value="category2_Asc">User 2 Category: Ascending</Option>
          ) : null}
          {isCompare ? (
            <Option value="category2_Desc">User 2 Category: Descending</Option>
          ) : null}
        </Select>
      </FormGroup>
      <FormGroup>
        <FormLabel>
          {isCompare ? 'Filter by User 1 category:' : 'Filter by category:'}{' '}
        </FormLabel>
        <Select {...register('filter1')} onChange={handleInputChange}>
          <Option value="">None</Option>
          <CategoryOptions taxonomyId={taxonomyId} />
        </Select>
      </FormGroup>
      {isCompare ? (
        <>
          <FormGroup>
            <FormLabel>Filter by User 2 category: </FormLabel>
            <Select {...register('filter2')} onChange={handleInputChange}>
              <Option value="">None</Option>
              <CategoryOptions taxonomyId={taxonomyId} />
            </Select>
          </FormGroup>
          <FormGroup>
            <FormLabel style={{ display: 'flex', alignItems: 'center' }}>
              Show different only:{' '}
              <Switch
                isOn={toggleValue}
                handleToggle={handleToggle}
                id="showDifferent"
              />
            </FormLabel>
          </FormGroup>
        </>
      ) : null}
      <Button onClick={handleReset}>Reset</Button>
    </Form>
  );
};

TableOptions.propTypes = {
  selectedDataId: PropTypes.number,
  taxonomyId: PropTypes.number,
  isCompare: PropTypes.bool
};

export default TableOptions;

const Form = styled.form`
  grid-row: 1;
  grid-column: 2;
`;
const FormGroup = styled.div`
  padding: 0.2rem;
`;
const FormLabel = styled.label`
  font-weight: 500;
`;
const FormInput = styled.input`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  border: solid 1px gray;
`;
const Select = styled.select`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
`;
const Option = styled.option``;
const Button = styled.button`
  margin: 0.5em;
  background: #fca311;
  color: #2d3142;
`;
