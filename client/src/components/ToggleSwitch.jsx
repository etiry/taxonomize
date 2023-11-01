import PropTypes from 'prop-types';

const Switch = ({ isOn, handleToggle }) => (
  <>
    <input
      checked={isOn}
      onChange={handleToggle}
      className="react-switch-checkbox"
      id="react-switch-new"
      type="checkbox"
    />
    <label
      style={{ background: isOn && '#fca311' }}
      className="react-switch-label"
      htmlFor="react-switch-new"
    >
      <span className="react-switch-button" />
    </label>
  </>
);

Switch.propTypes = {
  handleToggle: PropTypes.func,
  isOn: PropTypes.bool
};

export default Switch;
