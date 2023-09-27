import PropTypes from 'prop-types';
import styled from 'styled-components';

const DataDetail = ({ data }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeading>Name</TableHeading>
        <TableHeading>Taxonomy</TableHeading>
        <TableHeading>Completed</TableHeading>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableColumn>{data.name}</TableColumn>
        <TableColumn>{data.taxonomy.name}</TableColumn>
        <TableColumn>{data.completed ? 'Yes' : 'No'}</TableColumn>
      </TableRow>
    </TableBody>
  </Table>
);

DataDetail.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    completed: PropTypes.bool,
    name: PropTypes.string,
    taxonomy: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  })
};

export default DataDetail;

const Table = styled.table`
  grid-row: 1;
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr``;

const TableHeading = styled.th``;

const TableColumn = styled.td``;
