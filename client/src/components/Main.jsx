import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useGetDemoDataQuery } from '../slices/demoSlice';
import Dashboard from './Dashboard';
import Team from './Team';
import Dataset from './Dataset';
import { team, dataInfo } from '../assets/demoData.json';
import Datasets from './Datasets';
import Compare from './Compare';

const Main = ({ contentType }) => {
  const [isDemo, setIsDemo] = useState(true);
  const [demoData, setDemoData] = useState(null);
  const { data } = useGetDemoDataQuery();

  useEffect(() => {
    setDemoData({
      pageInfo: {
        total: 10,
        totalPages: 1,
        startSize: 1,
        endSize: 10
      },
      nodes: data.map((ob, index) => ({
        ...ob,
        user2_category_name:
          dataInfo.nodes[0].users[1].categories[index].user2_category_name
      }))
    });
  }, [data]);

  if (contentType === 'dashboard') {
    return <Dashboard />;
  }

  if (contentType === 'team') {
    return <Team isDemo={isDemo} demoTeamData={team} />;
  }

  if (contentType === 'datasets') {
    return <Datasets dataInfo={dataInfo} />;
  }

  if (contentType === 'demoDataset') {
    return (
      <Dataset
        isDemo={isDemo}
        dataInfo={dataInfo}
        demoData={demoData}
        setDemoData={setDemoData}
      />
    );
  }

  if (contentType === 'compare') {
    return (
      <Compare
        isDemo={isDemo}
        dataInfo={dataInfo}
        demoData={demoData}
        setDemoData={setDemoData}
      />
    );
  }
};

Main.propTypes = {
  contentType: PropTypes.string
};

export default Main;
