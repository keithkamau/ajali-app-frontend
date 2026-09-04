import React from "react";
import IncidentForm from "../components/incidents/IncidentForm";

const CreateIncidentPage = () => {
  return (
    <div className='create-incident-page'>
      <IncidentForm isEditing={false} />
    </div>
  );
};

export default CreateIncidentPage;
