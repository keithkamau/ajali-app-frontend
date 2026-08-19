import IncidentCard from "./IncidentCard";

export default function IncidentList({ incidents = [], loading, onDelete }) {
	if (loading) return <div className="empty-state"><strong>Loading reports...</strong></div>;
	if (!incidents.length) return <div className="empty-state"><strong>No reports yet</strong><p>Your incident reports will appear here.</p></div>;
	return <div className="incident-list">{incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} onDelete={onDelete} />)}</div>;
}
