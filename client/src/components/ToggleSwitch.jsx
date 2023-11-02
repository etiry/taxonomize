import PropTypes from 'prop-types';

const Switch = ({ isOn, handleToggle, id }) => (
  <>
    <input
      checked={isOn}
      onChange={handleToggle}
      className="react-switch-checkbox"
      id={id}
      type="checkbox"
    />
    <label
      style={{ background: isOn && '#fca311' }}
      className="react-switch-label"
      htmlFor={id}
    >
      <span className="react-switch-button" />
    </label>
  </>
);

Switch.propTypes = {
  handleToggle: PropTypes.func,
  isOn: PropTypes.bool,
  id: PropTypes.string
};

export default Switch;
