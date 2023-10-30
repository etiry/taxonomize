import styled from 'styled-components';
import { useState } from 'react';
import SideNav from './SideNav';
import Main from './Main';

const Demo = () => {
  const [contentType, setContentType] = useState('dashboard');

  return (
    <ContentContainer>
      <SideNav setContentType={setContentType} />
      <Main contentType={contentType} />
    </ContentContainer>
  );
};

export default Demo;

const ContentContainer = styled.main`
  display: grid;
  grid-template-columns: 1fr 5fr;
  margin-top: 140px;
  z-index: 1;
`;
