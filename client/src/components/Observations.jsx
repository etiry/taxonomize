import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import {
  useGetCategoriesQuery,
  useAssignCategoryMutation
} from '../slices/apiSlice';

const Observations = ({ observations, taxonomyId }) => {
  const theme = useTheme(getTheme());
  const data = { nodes: observations };
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCategoriesQuery(taxonomyId);
  const [assignCategory] = useAssignCategoryMutation();

  const handleUpdate = async (observationId, event) => {
    const queryParams = { observationId, categoryId: event.target.value };
    try {
      await assignCategory(queryParams);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  if (isSuccess) {
    return (
      <Container>
        <Table data={data} theme={theme} layout={{ fixedHeader: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Text</HeaderCell>
                  <HeaderCell>Category</HeaderCell>
                  <HeaderCell>Select a Category</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item._id} item={item}>
                    <Cell>{item.text}</Cell>
                    <Cell>{item.category}</Cell>
                    <Cell>
                      <select
                        style={{
                          width: '100%',
                          border: 'none',
                          fontSize: '1rem',
                          padding: 0,
                          margin: 0
                        }}
                        value={item.type}
                        onChange={(event) => handleUpdate(item._id, event)}
                      >
                        <option value="">-- Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
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
  width: 100%;
  grid-row: 2 / end;
`;
