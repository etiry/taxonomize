import PropTypes from 'prop-types';
import styled from 'styled-components';

const DataDetail = ({ data }) => (
  <Container>
    <DataDetailItem>Name: {data.name}</DataDetailItem>
    <DataDetailItem>Taxonomy: {data.taxonomy_id}</DataDetailItem>
    <DataDetailItem>Completed: {data.completed ? 'Yes' : 'No'}</DataDetailItem>
  </Container>
);

DataDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    dataset_id: PropTypes.number,
    taxonomy_id: PropTypes.number,
    completed: PropTypes.bool,
    name: PropTypes.string
  })
};

export default DataDetail;

const Container = styled.div`
  grid-row: 1;
`;

const DataDetailItem = styled.div``;
