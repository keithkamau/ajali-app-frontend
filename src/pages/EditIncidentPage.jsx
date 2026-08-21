// src/pages/EditIncidentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncidentById,
  updateIncident,
  clearError,
  clearSuccess,
} from "../redux/slices/incidentSlice";
import IncidentForm from "../components/incidents/IncidentForm";

export const EditIncidentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentIncident, loading, error, success } = useSelector(
    (state) => state.incidents,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchIncidentById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentIncident) {
      setIsLoading(false);
    }
  }, [currentIncident]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        navigate(`/incidents/${id}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate, id]);

  const handleSubmit = async (formData) => {
    await dispatch(updateIncident({ id, data: formData }));
  };

  if (isLoading || loading) {
    return (
      <div className='loading-state'>
        <span className='spinner'></span>
        <p>Loading incident details...</p>
      </div>
    );
  }

  if (error && !currentIncident) {
    return (
      <div className='alert alert-error'>
        {error}
        <button
          onClick={() => navigate("/dashboard")}
          className='btn btn-secondary'
          style={{ marginTop: "1rem" }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!currentIncident) {
    return (
      <div className='empty-state'>
        <p className='body-text text-muted'>Incident not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          className='btn btn-primary'
          style={{ marginTop: "1rem" }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className='edit-incident-page'>
      <div className='page-header'>
        <button
          onClick={() => navigate(`/incidents/${id}`)}
          className='back-link'
        >
          ← Back to Incident
        </button>
        <h1 className='heading-2'>Edit Incident</h1>
        <p className='body-small text-muted'>
          Update the details of your incident report
        </p>
      </div>

      {error && <div className='alert alert-error'>{error}</div>}
      {success && <div className='alert alert-success'>{success}</div>}

      <IncidentForm
        initialData={currentIncident}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default EditIncidentPage;
