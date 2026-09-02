import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import IncidentForm from "../../components/incidents/IncidentForm";
import incidentReducer from "../../redux/slices/incidentSlice";

test("renders the incident reporting fields", () => {
	const store = configureStore({ reducer: { incidents: incidentReducer } });
	render(<Provider store={store}><MemoryRouter><IncidentForm /></MemoryRouter></Provider>);
expect(screen.getByRole("heading", { name: /report an incident/i })).toBeInTheDocument();
	expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
	expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
	expect(screen.getByRole("button", { name: /use my location/i })).toBeInTheDocument();
});
