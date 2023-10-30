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
import Spinner from './Spinner';

const Datasets = ({ dataInfo }) => {
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

  if (dataInfo || isSuccess) {
    return (
      <ContentContainer>
        <Wrapper>
          <Heading>All Datasets</Heading>
          <Button onClick={() => toggleModal(true)}>Add Dataset</Button>
        </Wrapper>

        <TableContainer>
          <Table
            data={dataInfo || data}
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
                      <Cell>{item.name || item.dataset_name}</Cell>
                      <Cell>
                        <Button
                          onClick={async () => {
                            if (!dataInfo) {
                              await dispatch(setSelectedDataId(item.id));
                              toggleModal(false);
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (!dataInfo) {
                              deleteData(item.id);
                            }
                          }}
                          $delete
                        >
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
        </TableContainer>
      </ContentContainer>
    );
  }
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return (
      <ContentContainer>There was an error loading this page</ContentContainer>
    );
  }
};

Datasets.propTypes = {
  dataInfo: PropTypes.object
};

export default Datasets;

const ContentContainer = styled.main`
  grid-column: 2 / end;
  grid-row: 2 / end;
  padding: 1rem;
  z-index: 1;
`;

const Button = styled.button`
  margin: 1em;
  background: ${(props) => (props.$delete ? '#d11a2a' : null)};
  color: ${(props) => (props.$delete ? '#fff' : null)};
`;

const Heading = styled.h3``;

const TableContainer = styled.div``;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
