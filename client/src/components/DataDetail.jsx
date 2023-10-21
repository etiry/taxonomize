import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useMarkDataCompleteMutation } from '../slices/apiSlice';
import ToggleSwitch from './ToggleSwitch';

const DataDetail = ({ data }) => {
  const [markDataComplete] = useMarkDataCompleteMutation();
  const [toggleValue, setToggleValue] = useState(data.completed);

  const handleToggle = async () => {
    await markDataComplete({
      datasetAssignmentId: data.id,
      value: !toggleValue
    });
    setToggleValue(!toggleValue);
  };

  return (
    <Container>
      <DataDetailItem>
        <Label>Name: </Label>
        {data.dataset_name}
      </DataDetailItem>
      <DataDetailItem>
        <Label>Taxonomy: </Label>
        {data.taxonomy_name}
      </DataDetailItem>
      <DataDetailItem>
        <Label>Completed: </Label>
        <ToggleSwitch isOn={toggleValue} handleToggle={handleToggle} />
      </DataDetailItem>
    </Container>
  );
};

DataDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    dataset_id: PropTypes.number,
    taxonomy_id: PropTypes.number,
    completed: PropTypes.bool,
    dataset_name: PropTypes.string,
    taxonomy_name: PropTypes.string
  })
};

export default DataDetail;

const Container = styled.div`
  grid-row: 1;
  grid-column: 1;
`;

const DataDetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.2rem;
`;

const Label = styled.span`
  font-weight: 500;
  padding-right: 0.2rem;
`;
