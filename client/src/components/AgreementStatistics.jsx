import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiSlice } from '../slices/apiSlice';
import { selectGetObsParams } from '../slices/paramsSlice';
import {
  selectSelectedDataId,
  selectComparedUsers
} from '../slices/selectionsSlice';

const AgreementStatistics = ({ isDemo, dataInfo, demoData }) => {
  const obsParams = useSelector(selectGetObsParams);
  const selectedDataId = useSelector(selectSelectedDataId);
  const comparedUsers = useSelector(selectComparedUsers);
  const { data } = apiSlice.endpoints.getObservations.useQueryState({
    dataId: selectedDataId,
    userIds: [comparedUsers.user1, comparedUsers.user2],
    page: 1,
    query: obsParams.query,
    sort: obsParams.sort,
    filter: obsParams.filter
  });

  useEffect(() => {
    if (isDemo) {
      demoData.nodes.map((ob, index) => ({
        ...ob,
        user2_category_name:
          dataInfo.nodes[0].users[1].categories[index].user2_category_name
      }));
    }
  }, [isDemo, dataInfo, demoData]);

  console.log(demoData);

  return (
    <>
      <Item>
        <Label>Percent agreement: </Label>
        {data?.agreement.percentAgreement
          ? data.agreement.percentAgreement
          : 'N/A'}
      </Item>
      <Item>
        <Label>Cohen's kappa: </Label>
        {data?.agreement.cohensKappa ? data.agreement.cohensKappa : 'N/A'}
      </Item>
    </>
  );
};

AgreementStatistics.propTypes = {
  dataInfo: PropTypes.object,
  demoData: PropTypes.object,
  isDemo: PropTypes.bool
};

export default AgreementStatistics;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0.2rem;
`;

const Label = styled.span`
  font-weight: 500;
  padding-right: 0.2rem;
`;
