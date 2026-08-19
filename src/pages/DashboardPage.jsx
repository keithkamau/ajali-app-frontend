import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidents } from "../redux/slices/incidentSlice";
import IncidentList from "../components/incidents/IncidentList";

export default function DashboardPage() { const dispatch = useDispatch(); const { items, loading, error } = useSelector((state) => state.incidents); useEffect(() => { dispatch(fetchIncidents()); }, [dispatch]); return <section className="dashboard-page"><div className="page-heading"><div><p className="eyebrow">My reports</p><h1>Keep an eye on what you reported.</h1><p className="muted">Track updates and add detail when responders need it.</p></div><Link className="button button-primary" to="/incidents/create">+ New report</Link></div>{error && <div className="alert">{error}</div>}<IncidentList incidents={items} loading={loading} /></section>; }
