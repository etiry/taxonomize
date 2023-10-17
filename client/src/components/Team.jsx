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

const Team = () => {
  const dispatch = useDispatch();
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(materialTheme);
  const team = useSelector(selectCurrentUserTeam);
  const { data: teamUsers, isSuccess } = useGetTeamUsersQuery(team.id);
  const data = { nodes: teamUsers };
  const [removeTeam] = useRemoveTeamMutation();

  const toggleModal = (bool) => {
    dispatch(setFormType({ entity: 'Team', new: bool }));
    dispatch(setIsOpen());
  };

  const handleRemoveTeam = (userId) => {
    removeTeam(userId);
    localStorage.setItem('taxonomizeTeam', {});
  };

  if (!team.id) {
    return (
      <Container>
        <Button onClick={() => toggleModal(true)}>Create a Team</Button>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container>
        <Button onClick={() => toggleModal(false)}>Add Team Members</Button>
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
                      <Button onClick={() => handleRemoveTeam(item.id)}>
                        Remove
                      </Button>
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

export default Team;

const Container = styled.div`
  // max-height: 425px;
  // overflow-y: scroll;
  width: 100%;
  grid-row: 2 / end;
  grid-column: 1 / 3;
`;

const Button = styled.button``;
