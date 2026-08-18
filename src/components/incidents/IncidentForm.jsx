import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addIncident, editIncident } from "../../redux/slices/incidentSlice";

const types = ["Accident", "Fire", "Medical emergency", "Crime", "Infrastructure", "Other"];

export default function IncidentForm({ incident }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [media, setMedia] = useState([]);
	const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: incident || { type: "Accident", is_anonymous: false } });

	useEffect(() => { if (incident) Object.entries(incident).forEach(([key, value]) => setValue(key, value)); }, [incident, setValue]);

	const useMyLocation = () => navigator.geolocation?.getCurrentPosition(({ coords }) => { setValue("location_lat", coords.latitude); setValue("location_lng", coords.longitude); });
	const onSubmit = async (values) => { const payload = { ...values, location_lat: Number(values.location_lat), location_lng: Number(values.location_lng) }; const action = incident ? editIncident({ id: incident.id, payload }) : addIncident({ ...payload, media }); const result = await dispatch(action); if (!action.rejected.match(result)) navigate(incident ? `/incidents/${incident.id}` : "/dashboard"); };

	return <form className="incident-form" onSubmit={handleSubmit(onSubmit)}>
		<div className="form-heading"><div><p className="eyebrow">Incident report</p><h1>{incident ? "Update report" : "Tell us what happened"}</h1><p className="muted">Share the details responders need to act quickly.</p></div><span className="required-note">* Required</span></div>
		<label>Title *<input {...register("title", { required: "Add a short title" })} placeholder="e.g. Two-car collision on Thika Road" />{errors.title && <small className="field-error">{errors.title.message}</small>}</label>
		<label>What happened? *<textarea rows="5" {...register("description", { required: "Describe the incident" })} placeholder="Give a clear description of what you saw..." />{errors.description && <small className="field-error">{errors.description.message}</small>}</label>
		<label>Incident type *<select {...register("type", { required: true })}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
		<section className="location-box"><div className="section-row"><div><p className="eyebrow">Location</p><h2>Where is it happening?</h2></div><button type="button" className="button button-quiet" onClick={useMyLocation}>Use my location</button></div><div className="field-grid"><label>Latitude<input type="number" step="any" {...register("location_lat", { required: "Latitude is required" })} placeholder="-1.286389" /></label><label>Longitude<input type="number" step="any" {...register("location_lng", { required: "Longitude is required" })} placeholder="36.817223" /></label></div><label>Address or landmark<input {...register("location_address")} placeholder="e.g. Near Kenyatta Avenue roundabout" /></label></section>
		<label className="checkbox-row"><input type="checkbox" {...register("is_anonymous")} /> Submit anonymously</label>
		<label>Evidence <input type="file" accept="image/*,video/*" multiple onChange={(event) => setMedia(Array.from(event.target.files || []))} /><small className="muted">Images and videos help responders verify the report.</small></label>
		{media.length > 0 && <div className="file-list">{media.map((file) => <span key={file.name}>{file.type.startsWith("video") ? "Video" : "Image"}: {file.name}</span>)}</div>}
		<div className="form-actions"><button type="button" className="button button-quiet" onClick={() => navigate(-1)}>Cancel</button><button className="button button-primary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : incident ? "Save changes" : "Submit report"}</button></div>
	</form>;
}
