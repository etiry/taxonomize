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

const CompareDatasets = ({ taxonomyId, isDemo, demoData }) => {
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const customTheme = {
    BaseRow: `
      background-color: #f5f5f5;
    `,
    BaseCell: `
    background-color: #f5f5f5;
    `
  };
  const theme = useTheme([materialTheme, customTheme]);
  const dispatch = useDispatch();
  const selectedDataId = useSelector(selectSelectedDataId);
  const comparedUsers = useSelector(selectComparedUsers);
  const obsParams = useSelector(selectGetObsParams);
  const [getObs] = useLazyGetObservationsQuery();
  const [assignFinalCategory] = useAssignFinalCategoryMutation();
  let userData = {};

  const onPaginationChange = async (action, state) => {
    await getObs({
      dataId: selectedDataId,
      page: pagination.state.page + 1,
      query: obsParams.query,
      sort: obsParams.sort,
      filter: obsParams.filter,
      differentOnly: obsParams.differentOnly
    });
  };

  const pagination = usePagination(
    userData,
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

  userData = useGetObservationsQuery({
    dataId: selectedDataId,
    userIds: [comparedUsers.user1, comparedUsers.user2],
    page: pagination.state.page + 1,
    query: obsParams.query,
    sort: obsParams.sort,
    filter: obsParams.filter,
    differentOnly: obsParams.differentOnly
  }).data;

  const handleUpdate = async (observationId, event) => {
    if (!isDemo) {
      const queryParams = {
        observationId,
        categoryId: event.target.value
      };
      try {
        await assignFinalCategory(queryParams);
      } catch (error) {
        console.log(`${error}`);
      }
    }
  };

  const escapeCsvCell = (cell) => {
    if (cell == null) {
      return '';
    }
    const sc = cell.toString().trim();
    if (sc === '' || sc === '""') {
      return sc;
    }
    if (
      sc.includes('"') ||
      sc.includes(',') ||
      sc.includes('\n') ||
      sc.includes('\r')
    ) {
      return `"${sc.replace(/"/g, '""')}"`;
    }
    return sc;
  };

  const makeCsvData = (columns, data) =>
    data.reduce(
      (csvString, rowItem) =>
        `${csvString}${columns
          .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
          .join(',')}\r\n`,
      `${columns.map(({ name }) => escapeCsvCell(name)).join(',')}\r\n`
    );

  const downloadAsCsv = (columns, data, filename) => {
    const csvData = makeCsvData(columns, data);
    const csvFile = new Blob([csvData], { type: 'text/csv' });
    const downloadLink = document.createElement('a');

    downloadLink.display = 'none';
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.text, name: 'Text' },
      {
        accessor: (item) => item.user1_category_name,
        name: 'User 1 Category Name'
      },
      {
        accessor: (item) => item.user2_category_name,
        name: 'User 2 Category Name'
      }
    ];

    downloadAsCsv(columns, userData.allObs, 'table');
  };

  if (demoData || userData) {
    return (
      <Container>
        {demoData ? null : (
          <Button onClick={handleDownloadCsv}>Download as CSV</Button>
        )}
        <Table
          data={demoData || userData}
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
                          padding: 0,
                          margin: 0
                        }}
                        value={item.type}
                        onChange={(event) => handleUpdate(item.id, event)}
                      >
                        <option value="">SELECT A CATEGORY</option>
                        <CategoryOptions taxonomyId={taxonomyId} />
                      </select>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>

        {(demoData?.pageInfo || userData.pageInfo) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>
              Total Rows: {demoData?.pageInfo.total || userData.pageInfo.total}
            </span>
            <span>
              Rows per page:{' '}
              {demoData?.pageInfo.startSize || userData.pageInfo.startSize}-
              {demoData?.pageInfo.endSize || userData.pageInfo.endSize}
              {' of '}
              {demoData?.pageInfo.total || userData.pageInfo.total}{' '}
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
                  pagination.state.page + 1 === demoData?.pageInfo.totalPages ||
                  userData.pageInfo.totalPages
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
                  pagination.state.page + 1 === demoData?.pageInfo.totalPages ||
                  userData.pageInfo.totalPages
                }
                onClick={() =>
                  pagination.fns.onSetPage(
                    demoData?.pageInfo.totalPages ||
                      userData.pageInfo.totalPages - 1
                  )
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

  return <Container />;
};

CompareDatasets.propTypes = {
  demoData: PropTypes.object,
  isDemo: PropTypes.bool,
  taxonomyId: PropTypes.number
};

export default CompareDatasets;

const Container = styled.div`
  width: 100%;
  grid-row: 2 / end;
  grid-column: 1 / 3;
`;

const Button = styled.button`
  margin: 0.5em;
  background: #fca311;
  color: #2d3142;
`;
