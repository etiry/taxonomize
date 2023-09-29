import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import DataDetail from './DataDetail';
import Observations from './Observations';

const Content = ({ selectedDataId }) => {
  const user = useSelector(selectCurrentUser);

  const selectedData = apiSlice.endpoints.getData.useQueryState(user, {
    selectFromResult: ({ data }) => data?.find((d) => d._id === selectedDataId)
  });

  console.log(selectedData);

  if (selectedDataId) {
    return (
      <ContentContainer>
        <DataDetail data={selectedData} />;
        <Observations
          observations={selectedData.observations}
          taxonomyId={selectedData.taxonomy._id}
        />
      </ContentContainer>
    );
  }

  return <ContentContainer>This is the content</ContentContainer>;
};

Content.propTypes = {
  selectedDataId: PropTypes.string
};

export default Content;

const ContentContainer = styled.header`
  grid-column: 2 / end;
  display: grid;
  grid-template-row: 1fr 4fr;
  justify-items: center;
  max-width: 100%;
`;
