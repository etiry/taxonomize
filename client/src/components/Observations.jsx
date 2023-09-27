import PropTypes from 'prop-types';
import styled from 'styled-components';
import CategoryDropdown from './CategoryDropdown';
import { useGetCategoriesQuery } from '../slices/apiSlice';

const Observations = ({ observations, taxonomyId }) => {
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCategoriesQuery(taxonomyId);

  if (isSuccess) {
    return (
      <Container>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeading>Text</TableHeading>
              <TableHeading>Category</TableHeading>
              <TableHeading>Select Category</TableHeading>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.map((ob) => (
              <TableRow key={ob._id}>
                <TableColumn>{ob.text}</TableColumn>
                <TableColumn>{ob.category}</TableColumn>
                <TableColumn>
                  <CategoryDropdown
                    categories={categories}
                    observationId={ob._id}
                  />
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
  }
};

Observations.propTypes = {
  observations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      text: PropTypes.string,
      category: PropTypes.string
    })
  ),
  taxonomyId: PropTypes.string
};

export default Observations;

const Container = styled.div`
  max-height: 400px;
  overflow-y: scroll;
  grid-row: 2 / end;
`;

const Table = styled.table``;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr``;

const TableHeading = styled.th``;

const TableColumn = styled.td``;
