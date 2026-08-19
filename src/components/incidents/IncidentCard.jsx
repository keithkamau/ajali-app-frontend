import { Link } from "react-router-dom";

const statusLabel = { pending: "Pending review", under_investigation: "Under investigation", rejected: "Rejected", resolved: "Resolved" };

export default function IncidentCard({ incident }) {
	const status = incident.status || "pending";
	return <article className="incident-card"><div className="card-topline"><span className={`status status-${status}`}>{statusLabel[status] || status.replaceAll("_", " ")}</span><time>{incident.created_at ? new Date(incident.created_at).toLocaleDateString() : "Just now"}</time></div><h3>{incident.title}</h3><p>{incident.description}</p><div className="card-meta"><span>{incident.type}</span><span>{incident.location_address || `${incident.location_lat}, ${incident.location_lng}`}</span></div><Link className="text-link" to={`/incidents/${incident.id}`}>View report <span aria-hidden="true">-&gt;</span></Link></article>;
}
