import { RotatingLines } from 'react-loader-spinner';

const Spinner = () => (
  <RotatingLines
    strokeColor="grey"
    strokeWidth="5"
    animationDuration="0.75"
    width="25"
    visible
  />
);

export default Spinner;
