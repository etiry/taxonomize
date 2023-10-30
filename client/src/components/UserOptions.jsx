import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useGetDataUsersQuery } from '../slices/apiSlice';

const UserOptions = ({ dataId, isDemo, dataInfo }) => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDataUsersQuery(dataId);

  if (isDemo) {
    return (
      <>
        {dataInfo.nodes[0].users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </>
    );
  }
};

UserOptions.propTypes = {
  dataId: PropTypes.number,
  dataInfo: PropTypes.object,
  isDemo: PropTypes.bool
};

export default UserOptions;

const Option = styled.option``;
