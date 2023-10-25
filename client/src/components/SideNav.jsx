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

const SideNav = () => {
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
            <LinkItem>
              <Link>{selectedTaxonomy.name}</Link>
            </LinkItem>
            <IndentLinkItem>
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
            <IndentLinkItem>
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
};

export default SideNav;

const Nav = styled.nav`
  min-height: 100vh;
  grid-column: 1;
  grid-row: 2;
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
