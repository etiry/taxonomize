import PropTypes from 'prop-types';
import styled from 'styled-components';
import Cohen from 'cohens-kappa';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  reformatAgreementData,
  calculatePercentAgreement
} from '../util/agreementStatistics';
import { apiSlice } from '../slices/apiSlice';
import { selectGetObsParams } from '../slices/paramsSlice';
import {
  selectSelectedDataId,
  selectComparedUsers
} from '../slices/selectionsSlice';

const AgreementStatistics = ({ isDemo, dataInfo, demoData, setDemoData }) => {
  const obsParams = useSelector(selectGetObsParams);
  const selectedDataId = useSelector(selectSelectedDataId);
  const comparedUsers = useSelector(selectComparedUsers);
  const { data } = apiSlice.endpoints.getObservations.useQueryState({
    dataId: selectedDataId,
    userIds: [comparedUsers.user1, comparedUsers.user2],
    page: 1,
    query: obsParams.query,
    sort: obsParams.sort,
    filter: obsParams.filter,
    differentOnly: obsParams.differentOnly
  });

  useEffect(() => {
    if (isDemo) {
      const user1Data = reformatAgreementData(demoData.nodes, 1);
      const user2Data = reformatAgreementData(demoData.nodes, 2);

      const cohensKappa = Cohen.kappa(user1Data, user2Data, 81, 'none');

      setDemoData((prevState) => ({
        pageInfo: prevState.pageInfo,
        nodes: prevState.nodes,
        agreement: {
          ...prevState.agreement,
          percentAgreement: calculatePercentAgreement(user1Data, user2Data),
          cohensKappa: cohensKappa.message ? null : cohensKappa
        }
      }));
    }
  }, [isDemo, dataInfo, setDemoData]);

  if (isDemo) {
    return (
      <>
        <Item>
          <Label>Percent agreement: </Label>
          {demoData.agreement.percentAgreement || 'N/A'}
        </Item>
        <Item>
          <Label>Cohen's kappa: </Label>
          {demoData.agreement.cohensKappa || 'N/A'}
        </Item>
      </>
    );
  }

  if (data) {
    return (
      <>
        <Item>
          <Label>Percent agreement: </Label>
          {data.agreement.percentAgreement || 'N/A'}
        </Item>
        <Item>
          <Label>Cohen's kappa: </Label>
          {data.agreement.cohensKappa || 'N/A'}
        </Item>
      </>
    );
  }
};

AgreementStatistics.propTypes = {
  dataInfo: PropTypes.object,
  demoData: PropTypes.object,
  isDemo: PropTypes.bool,
  setDemoData: PropTypes.func
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
