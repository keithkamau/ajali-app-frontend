import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncident } from "../redux/slices/incidentSlice";
import IncidentForm from "../components/incidents/IncidentForm";

export default function EditIncidentPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const incident = useSelector((state) => state.incidents.current);
  useEffect(() => {
    dispatch(fetchIncident(id));
  }, [dispatch, id]);
  return incident ? (
    <IncidentForm incident={incident} />
  ) : (
    <div className='empty-state'>Loading report...</div>
  );
}
