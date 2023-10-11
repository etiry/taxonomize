import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  apiSlice,
  useGetDataQuery,
  useLazyGetObservationsQuery
} from '../slices/apiSlice';
import { selectCurrentUser } from '../slices/authSlice';
import {
  selectSelectedTaxonomyId,
  setSelectedDataId,
  setIsOpen,
  setFormType
} from '../slices/selectionsSlice';

const SideNav = ({ setContentType }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedTaxonomy = apiSlice.endpoints.getTaxonomies.useQueryState(
    user,
    {
      selectFromResult: ({ data }) =>
        data?.find((d) => d.id === parseInt(selectedTaxonomyId))
    }
  );
  const { data, isLoading, isSuccess, isError, error } = useGetDataQuery(user);
  const [getObs] = useLazyGetObservationsQuery();
  const [showData, setShowData] = useState(true);

  const toggleDatasets = () => {
    setShowData(!showData);
  };

  const handleSelectData = async (dataId) => {
    const params = { page: 1, dataId, query: '', sort: '', filter: '' };
    await getObs(params);
    dispatch(setSelectedDataId(dataId));
    setContentType('dataDetail');
  };

  const toggleModal = () => {
    dispatch(setFormType({ entity: 'Taxonomy', new: false }));
    dispatch(setIsOpen());
  };

  let content;

  if (isLoading) {
    content = (
      <div style={{ display: showData ? 'block' : 'none' }}>Loading...</div>
    );
  } else if (isSuccess) {
    content = data.map((d) => (
      <ContentLinkItem
        key={d.dataset_id}
        style={{ display: showData ? 'block' : 'none' }}
        onClick={() => handleSelectData(d.dataset_id)}
      >
        <Link>{d.dataset_name}</Link>
      </ContentLinkItem>
    ));
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <Nav>
      <LinkList>
        <LinkItem>
          <Link onClick={() => setContentType('dashboard')}>Dashboard</Link>
        </LinkItem>
        <LinkItem>
          <Link onClick={() => setContentType('team')}>My Team</Link>
        </LinkItem>
        {selectedTaxonomy ? (
          <>
            <LinkItem>
              <Link>{selectedTaxonomy.name}</Link>
            </LinkItem>
            <IndentLinkItem>
              <Link onClick={toggleModal}>Edit Taxonomy</Link>
            </IndentLinkItem>
            <IndentLinkItem>
              <Link onClick={() => setContentType('allDatasets')}>
                All Datasets
              </Link>
            </IndentLinkItem>
            <IndentLinkItem>
              <Link onClick={toggleDatasets}>My Datasets</Link>
            </IndentLinkItem>
            {content}
            <IndentLinkItem>
              <Link onClick={() => setContentType('compareDatasets')}>
                Compare Datasets
              </Link>
            </IndentLinkItem>
          </>
        ) : null}
      </LinkList>
    </Nav>
  );
};

SideNav.propTypes = {
  setContentType: PropTypes.func
};

export default SideNav;

const Nav = styled.nav`
  min-height: 100vh;
  grid-column: 1;
`;

const LinkList = styled.ul`
  list-style-type: none;
`;

const LinkItem = styled.li``;

const IndentLinkItem = styled.li`
  padding-left: 1rem;
`;

const ContentLinkItem = styled.li`
  padding-left: 2rem;
`;

const Link = styled.a``;
