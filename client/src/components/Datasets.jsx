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
  useGetDataByTaxonomyQuery,
  useDeleteDataMutation
} from '../slices/apiSlice';
import { selectCurrentUser } from '../slices/authSlice';
import {
  selectSelectedTaxonomyId,
  setSelectedDataId,
  setIsOpen,
  setFormType
} from '../slices/selectionsSlice';

const Datasets = () => {
  const dispatch = useDispatch();
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(materialTheme);
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const { data, isLoading, isSuccess, isError, error } =
    useGetDataByTaxonomyQuery(selectedTaxonomyId);
  const [deleteData] = useDeleteDataMutation();

  const toggleModal = (bool) => {
    dispatch(setFormType({ entity: 'Dataset', new: bool }));
    dispatch(setIsOpen());
  };

  const onPaginationChange = async (action, state) => {};

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

  if (isSuccess) {
    return (
      <Container>
        <Button onClick={() => toggleModal(true)}>Add Dataset</Button>
        <Table
          data={data}
          theme={theme}
          layout={{ fixedHeader: true }}
          // pagination={pagination}
        >
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell />
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell>{item.name}</Cell>
                    <Cell>
                      <Button
                        onClick={async () => {
                          await dispatch(setSelectedDataId(item.id));
                          toggleModal(false);
                        }}
                      >
                        Edit
                      </Button>
                      <Button onClick={() => deleteData(item.id)}>
                        Delete
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>

        {/* {data.pageInfo && (
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
      )} */}
      </Container>
    );
  }
};

export default Datasets;

const Container = styled.div`
  // max-height: 425px;
  // overflow-y: scroll;
  width: 100%;
  grid-row: 2 / end;
  grid-column: 1 / 3;
`;

const Button = styled.button``;
