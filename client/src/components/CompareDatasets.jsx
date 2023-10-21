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
import { useSelector, useDispatch } from 'react-redux';
import {
  useLazyGetObservationsQuery,
  useAssignFinalCategoryMutation,
  useGetObservationsQuery
} from '../slices/apiSlice';
import { selectGetObsParams, setGetObsParams } from '../slices/paramsSlice';
import {
  selectSelectedDataId,
  selectComparedUsers
} from '../slices/selectionsSlice';
import CategoryOptions from './CategoryOptions';

const CompareDatasets = ({ taxonomyId }) => {
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(materialTheme);
  const dispatch = useDispatch();
  const selectedDataId = useSelector(selectSelectedDataId);
  const comparedUsers = useSelector(selectComparedUsers);
  const obsParams = useSelector(selectGetObsParams);
  const [getObs] = useLazyGetObservationsQuery();
  const [assignFinalCategory] = useAssignFinalCategoryMutation();
  let data = {};

  const onPaginationChange = async (action, state) => {
    await getObs({
      dataId: selectedDataId,
      page: pagination.state.page + 1,
      query: obsParams.query,
      sort: obsParams.sort,
      filter: obsParams.filter
    });
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

  data = useGetObservationsQuery({
    dataId: selectedDataId,
    userIds: [comparedUsers.user1, comparedUsers.user2],
    page: pagination.state.page + 1,
    query: obsParams.query,
    sort: obsParams.sort,
    filter: obsParams.filter
  }).data;

  const handleUpdate = async (observationId, event) => {
    const queryParams = {
      observationId,
      categoryId: event.target.value
    };
    try {
      await assignFinalCategory(queryParams);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  if (data) {
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
                  <HeaderCell>User 1 Category</HeaderCell>
                  <HeaderCell>User 2 Category</HeaderCell>
                  <HeaderCell>Final Category</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell>{item.text}</Cell>
                    <Cell>{item.user1_category_name}</Cell>
                    <Cell>{item.user2_category_name}</Cell>
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
                disabled={
                  pagination.state.page + 1 === data.pageInfo.totalPages
                }
                onClick={() =>
                  pagination.fns.onSetPage(pagination.state.page + 1)
                }
              >
                {'>'}
              </button>
              <button
                type="button"
                disabled={
                  pagination.state.page + 1 === data.pageInfo.totalPages
                }
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
  }
};

CompareDatasets.propTypes = {
  taxonomyId: PropTypes.number
};

export default CompareDatasets;

const Container = styled.div`
  // max-height: 425px;
  // overflow-y: scroll;
  width: 100%;
  grid-row: 2 / end;
  grid-column: 1 / 3;
`;

const Button = styled.button``;
