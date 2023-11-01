import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
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
import Spinner from './Spinner';

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

  const toggleDatasets = () => {
    setShowData(!showData);
    expandIcon === '-' ? setExpandIcon('+') : setExpandIcon('-');
  };

  const handleSelectData = async (dataId) => {
    await dispatch(setSelectedDataId(dataId));
    const params = {
      page: 1,
      dataId,
      userIds: user,
      query: '',
      sort: '',
      filter: ''
    };
    await getObs(params);
  };

  const toggleModal = () => {
    dispatch(setFormType({ entity: 'Taxonomy', new: false }));
    dispatch(setIsOpen());
  };

  let dataLinks;

  if (isLoading) {
    dataLinks = <Spinner />;
  } else if (isSuccess) {
    dataLinks = data.map((d) => (
      <ContentLinkItem
        key={d.dataset_id}
        style={{ display: showData ? 'block' : 'none' }}
        onClick={() => handleSelectData(d.dataset_id)}
      >
        <NavLink
          to={`/dataset/${d.dataset_id}`}
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          {d.dataset_name}
        </NavLink>
      </ContentLinkItem>
    ));
  } else if (isError) {
    dataLinks = <div>{error.toString()}</div>;
  }

  if (user) {
    return (
      <Nav>
        <LinkList>
          <LinkItem>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Dashboard
            </NavLink>
          </LinkItem>
          <LinkItem>
            <NavLink
              to="/team"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              My Team
            </NavLink>
          </LinkItem>
          {selectedTaxonomy ? (
            <>
              <LinkItem $indent>{selectedTaxonomy.name}</LinkItem>
              <IndentLinkItem $indent>
                <Link onClick={toggleModal}>Edit Taxonomy</Link>
              </IndentLinkItem>
              <IndentLinkItem>
                <NavLink
                  to="/datasets"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  All Datasets
                </NavLink>
              </IndentLinkItem>
              <IndentLinkItem $indent>
                <Link onClick={toggleDatasets}>My Datasets</Link>
              </IndentLinkItem>
              {dataLinks}
              <IndentLinkItem>
                <NavLink
                  to="/compare"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  onClick={() => {
                    dispatch(setSelectedDataId(null));
                    dispatch(setComparedUsers({ user1: null, user2: null }));
                  }}
                >
                  Compare Datasets
                </NavLink>
              </IndentLinkItem>
            </>
          ) : null}
        </LinkList>
      </Nav>
    );
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
        <LinkItem>Demo Taxonomy</LinkItem>
        <IndentLinkItem>
          <Link>Edit Taxonomy</Link>
        </IndentLinkItem>
        <IndentLinkItem>
          <Link onClick={() => setContentType('datasets')}>All Datasets</Link>
        </IndentLinkItem>
        <IndentLinkItem>
          <Link onClick={toggleDatasets}>My Datasets</Link>
        </IndentLinkItem>
        <ContentLinkItem style={{ display: showData ? 'block' : 'none' }}>
          <Link onClick={() => setContentType('demoDataset')}>
            Demo Dataset
          </Link>
        </ContentLinkItem>
        <IndentLinkItem>
          <Link onClick={() => setContentType('compare')}>
            Compare Datasets
          </Link>
        </IndentLinkItem>
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
  grid-row: 2;
  position: fixed;
  top: 100px;
  left: 0;
  background: #dcdcdc;
  padding-top: 2em;
  padding-right: 2em;
  border-right: 3px solid #14213d;
`;

const LinkList = styled.ul`
  list-style-type: none;
`;

const LinkItem = styled.li`
  margin: 0.75rem 0;
  margin-left: ${(props) => (props.$indent ? '2rem' : '1rem')};
  font-weight: 500;
`;

const IndentLinkItem = styled.li`
  margin: 0.75rem 0;
  padding-left: ${(props) => (props.$indent ? '3rem' : '2rem')};
`;

const ContentLinkItem = styled.li`
  margin: 0.75rem 0;
  padding-left: 3rem;
`;

const Link = styled.a`
  // cursor: pointer;
  // padding: 0.5rem 1.5rem;
  // border-radius: 1rem;
`;
