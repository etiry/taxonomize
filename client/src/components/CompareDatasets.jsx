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
  apiSlice,
  useAssignCategoryMutation,
  useLazyGetObservationsQuery,
  useGetUserAssignedCategoriesQuery
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
  let tableData = {};

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
    tableData,
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

  const { data } = apiSlice.endpoints.getObservations.useQueryState({
    dataId: selectedDataId,
    page: pagination.state.page + 1,
    query: obsParams.query,
    sort: obsParams.sort,
    filter: obsParams.filter
  });

  const { data: user1Data } = useGetUserAssignedCategoriesQuery({
    userId: comparedUsers.user1,
    dataId: selectedDataId,
    obIds: data?.nodes.map((ob) => ob.id) || []
  });

  const { data: user2Data } = useGetUserAssignedCategoriesQuery({
    userId: comparedUsers.user2,
    dataId: selectedDataId,
    obIds: data?.nodes.map((ob) => ob.id) || []
  });

  const nodes = data?.nodes.map((ob) => {
    let match1 = null;
    let match2 = null;

    match1 = user1Data?.find(
      (userDataOb) => userDataOb.observation_id === ob.id
    );
    match2 = user2Data?.find(
      (userDataOb) => userDataOb.observation_id === ob.id
    );
    return {
      ...ob,
      user1Category: match1 ? match1.category_name : null,
      user2Category: match2 ? match2.category_name : null
    };
  });

  tableData = { ...data, nodes };

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

  if (data) {
    return (
      <Container>
        <Table
          data={tableData}
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
                    <Cell>{item.user1Category}</Cell>
                    <Cell>{item.user2Category}</Cell>
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
