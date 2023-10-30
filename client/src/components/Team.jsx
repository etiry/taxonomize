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
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUserTeam } from '../slices/authSlice';
import {
  useGetTeamUsersQuery,
  useRemoveTeamMutation
} from '../slices/apiSlice';
import { setIsOpen, setFormType } from '../slices/selectionsSlice';
import Spinner from './Spinner';

const Team = ({ isDemo, demoTeamData }) => {
  const dispatch = useDispatch();
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(materialTheme);
  const team = useSelector(selectCurrentUserTeam);
  const {
    data: teamUsers,
    isSuccess,
    isLoading,
    isError
  } = useGetTeamUsersQuery(team.id);
  const data = { nodes: teamUsers };
  const [removeTeam] = useRemoveTeamMutation();

  const toggleModal = (bool) => {
    dispatch(setFormType({ entity: 'Team', new: bool }));
    dispatch(setIsOpen());
  };

  const handleRemoveTeam = (userId) => {
    removeTeam(userId);
    localStorage.setItem('taxonomizeTeam', { id: null, name: null });
  };

  if (isDemo) {
    return (
      <ContentContainer>
        <Wrapper>
          <Heading>My Team</Heading>
          <Button>Add Team Members</Button>
        </Wrapper>

        <TableContainer>
          <Table
            data={demoTeamData}
            theme={theme}
            layout={{ fixedHeader: true }}
          >
            {(tableList) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell />
                  </HeaderRow>
                </Header>

                <Body>
                  {tableList.map((item) => (
                    <Row key={item.id} item={item}>
                      <Cell>{item.name}</Cell>
                      <Cell>{item.email}</Cell>
                      <Cell>
                        <Button $delete>Remove</Button>
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </TableContainer>
      </ContentContainer>
    );
  }

  if (!team.id) {
    return (
      <ContentContainer>
        <Button onClick={() => toggleModal(true)}>Create a Team</Button>
      </ContentContainer>
    );
  }

  if (isSuccess) {
    return (
      <ContentContainer>
        <Wrapper>
          <Heading>My Team</Heading>
          <Button onClick={() => toggleModal(false)}>Add Team Members</Button>
        </Wrapper>

        <TableContainer>
          <Table data={data} theme={theme} layout={{ fixedHeader: true }}>
            {(tableList) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell />
                  </HeaderRow>
                </Header>

                <Body>
                  {tableList.map((item) => (
                    <Row key={item.id} item={item}>
                      <Cell>{item.name}</Cell>
                      <Cell>{item.email}</Cell>
                      <Cell>
                        <Button
                          onClick={() => handleRemoveTeam(item.id)}
                          $delete
                        >
                          Remove
                        </Button>
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
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

Team.propTypes = {
  demoTeamData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }),
  isDemo: PropTypes.bool
};

export default Team;

const ContentContainer = styled.main`
  padding: 1rem;
  z-index: 1;
`;

const Button = styled.button`
  margin: 0.5em;
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
