import PropTypes from 'prop-types';
import styled from 'styled-components';

const DataDetail = ({ data }) => (
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
      {data.completed ? 'Yes' : 'No'}
    </DataDetailItem>
  </Container>
);

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

const DataDetailItem = styled.div``;

const Label = styled.span`
  font-weight: bold;
`;
