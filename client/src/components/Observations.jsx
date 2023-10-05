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
import {
  DEFAULT_OPTIONS,
  getTheme
} from '@table-library/react-table-library/material-ui';
import { usePagination } from '@table-library/react-table-library/pagination';
import {
  apiSlice,
  useGetCategoriesQuery,
  useAssignCategoryMutation,
  useLazyGetObservationsQuery
} from '../slices/apiSlice';
import CategoryOptions from './CategoryOptions';

const Observations = ({ selectedDataId, taxonomyId, datasetAssignmentId }) => {
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(materialTheme);
  const [getObs] = useLazyGetObservationsQuery();
  let data = {};

  const onPaginationChange = async (action, state) => {
    await getObs(params);
  };

  const pagination = usePagination(
    data,
    {
      state: {
        page: 0,
        size: 10
      },
      onChange: onPaginationChange
    },
    {
      isServer: true
    }
  );

  const params = { page: pagination.state.page + 1, dataId: selectedDataId };
  data = apiSlice.endpoints.getObservations.useQueryState(params).data;

  const [assignCategory] = useAssignCategoryMutation();

  const handleUpdate = async (observationId, event) => {
    const queryParams = {
      observationId,
      categoryId: event.target.value,
      datasetAssignmentId
    };
    try {
      await assignCategory(queryParams);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  return (
    <Container>
      <Table
        data={data}
        theme={theme}
        layout={{ fixedHeader: true }}
        pagination={pagination}
      >
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
                <Row key={item.id} item={item}>
                  <Cell>{item.text}</Cell>
                  <Cell>{item.category_name}</Cell>
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
                      onChange={(event) => handleUpdate(item.id, event)}
                    >
                      <option value="">-- Select a category</option>
                      <CategoryOptions taxonomyId={taxonomyId} />
                    </select>
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>

      {data.pageInfo && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>Total Rows: {data.pageInfo.total}</span>
          <span>
            Rows per page: {data.pageInfo.startSize}-{data.pageInfo.endSize}
            {' of '}
            {data.pageInfo.total}{' '}
            <button
              type="button"
              disabled={pagination.state.page === 0}
              onClick={() => pagination.fns.onSetPage(0)}
            >
              {'|<'}
            </button>
            <button
              type="button"
              disabled={pagination.state.page === 0}
              onClick={() =>
                pagination.fns.onSetPage(pagination.state.page - 1)
              }
            >
              {'<'}
            </button>
            <button
              type="button"
              disabled={pagination.state.page + 1 === data.pageInfo.totalPages}
              onClick={() =>
                pagination.fns.onSetPage(pagination.state.page + 1)
              }
            >
              {'>'}
            </button>
            <button
              type="button"
              disabled={pagination.state.page + 1 === data.pageInfo.totalPages}
              onClick={() =>
                pagination.fns.onSetPage(data.pageInfo.totalPages - 1)
              }
            >
              {'>|'}
            </button>
          </span>
        </div>
      )}
    </Container>
  );
};

Observations.propTypes = {
  selectedDataId: PropTypes.number,
  taxonomyId: PropTypes.number,
  datasetAssignmentId: PropTypes.number
};

export default Observations;

const Container = styled.div`
  // max-height: 425px;
  // overflow-y: scroll;
  width: 100%;
  grid-row: 2 / end;
  grid-column: 1 / 3;
`;
