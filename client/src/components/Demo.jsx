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
  margin-top: 110px;
  z-index: 1;
  background-color: #f5f5f5;
  height: 100%;
  padding-top: 1em;
`;
