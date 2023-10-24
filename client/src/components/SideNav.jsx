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
  setFormType,
  setComparedUsers
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
  const { data, isLoading, isSuccess, isError, error } = useGetDataQuery({
    userId: user,
    taxonomyId: selectedTaxonomyId
  });
  const [getObs] = useLazyGetObservationsQuery();
  const [showData, setShowData] = useState(true);
  const [expandIcon, setExpandIcon] = useState('-');
  const [active, setActive] = useState(false);

  const toggleDatasets = () => {
    setShowData(!showData);
    expandIcon === '-' ? setExpandIcon('+') : setExpandIcon('-');
  };

  const handleSelectData = async (dataId) => {
    const params = {
      page: 1,
      dataId,
      userIds: user,
      query: '',
      sort: '',
      filter: ''
    };
    await getObs(params);
    dispatch(setSelectedDataId(dataId));
    setContentType('dataDetail');
  };

  const toggleModal = () => {
    dispatch(setFormType({ entity: 'Taxonomy', new: false }));
    dispatch(setIsOpen());
  };

  let dataLinks;

  if (isLoading) {
    dataLinks = (
      <div style={{ display: showData ? 'block' : 'none' }}>Loading...</div>
    );
  } else if (isSuccess) {
    dataLinks = data.map((d) => (
      <ContentLinkItem
        key={d.dataset_id}
        style={{ display: showData ? 'block' : 'none' }}
        onClick={() => handleSelectData(d.dataset_id)}
      >
        <Link>{d.dataset_name}</Link>
      </ContentLinkItem>
    ));
  } else if (isError) {
    dataLinks = <div>{error.toString()}</div>;
  }

  return (
    <Nav>
      <LinkList>
        <LinkItem>
          <Link
            className={active ? 'active' : null}
            onClick={() => {
              setContentType('dashboard');
              setActive(!active);
            }}
          >
            Dashboard
          </Link>
        </LinkItem>
        <LinkItem>
          <Link
            className={active ? 'active' : null}
            onClick={() => setContentType('team')}
          >
            My Team
          </Link>
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
            {dataLinks}
            <IndentLinkItem>
              <Link
                onClick={() => {
                  setContentType('compareDatasets');
                  dispatch(setSelectedDataId(null));
                  dispatch(setComparedUsers({ user1: null, user2: null }));
                }}
              >
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
  position: fixed;
  top: 140px;
  left: 0;
`;

const LinkList = styled.ul`
  list-style-type: none;
  margin-left: 1rem;
`;

const LinkItem = styled.li`
  margin: 0.75rem 0;
`;

const IndentLinkItem = styled.li`
  margin: 0.75rem 0;
  padding-left: 1rem;
`;

const ContentLinkItem = styled.li`
  margin: 0.75rem 0;
  padding-left: 2rem;
`;

const Link = styled.a`
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
`;
