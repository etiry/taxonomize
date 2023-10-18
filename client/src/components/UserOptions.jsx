import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useGetDataUsersQuery } from '../slices/apiSlice';

const UserOptions = ({ dataId }) => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDataUsersQuery(dataId);

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
  dataId: PropTypes.number
};

export default UserOptions;

const Option = styled.option``;
