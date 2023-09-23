import PropTypes from 'prop-types';
import styled from 'styled-components';

const App = ({ children }) => <AppContainer>{children}</AppContainer>;

App.propTypes = {
  children: PropTypes.any
};

export default App;

const AppContainer = styled.div``;
