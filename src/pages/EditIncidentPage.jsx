import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchIncidentById, clearError, clearSuccess } from "../redux/slices/incidentSlice";
import { IncidentForm } from "../components/incidents/IncidentForm";
import "./EditIncidentPage.css";

export const EditIncidentPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentIncident, isLoading, error, success } = useSelector(
        (state) => state.incidents
    );
    const [isLoadingIncident, setIsLoadingIncident] = useState(true);

    useEffect(() => {
        if (id) {
            dispatch(fetchIncidentById(id)).finally(() => {
                setIsLoadingIncident(false);
            });
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch]);

    if (isLoadingIncident || isLoading) {
        return (
            <div className="edit-incident-loading">
                <div className="spinner"></div>
                <p>Loading incident data...</p>
            </div>
        );
    }

    if (!currentIncident) {
        return (
            <div className="edit-incident-error">
                <h2>Incident Not Found</h2>
                <p>The incident you're trying to edit doesn't exist or you don't have permission.</p>
                <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="edit-incident-page">
            <div className="edit-incident-header">
                <Link to={`/incidents/${id}`} className="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back to Incident
                </Link>
                <h1 className="page-title">Edit Incident</h1>
            </div>

            {error && (
                <div className="alert alert-error">
                    {typeof error === 'string' ? error : error?.message || 'An error occurred'}
                </div>
            )}
            {success && (
                <div className="alert alert-success">{success}</div>
            )}

            <IncidentForm incident={currentIncident} isEditing={true} />
        </div>
    );
};

export default EditIncidentPage;