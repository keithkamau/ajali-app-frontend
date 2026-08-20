import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidents } from "../redux/slices/incidentSlice";
import IncidentList from "../components/incidents/IncidentList";

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.incidents);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  return (
    <div className='dashboard-page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>My reports</p>
          <h1 className='heading-2'>Keep an eye on what you reported.</h1>
          <p className='body-small text-muted'>
            Track updates and add detail when responders need it.
          </p>
        </div>
        <Link className='btn btn-primary' to='/incidents/create'>
          New report
        </Link>
      </div>
      {error && <div className='alert alert-error'>{error}</div>}
      <IncidentList incidents={items} loading={loading} />
    </div>
  );
};

export default DashboardPage;
