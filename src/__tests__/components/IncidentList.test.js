import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IncidentList from "../../components/incidents/IncidentList";

test("shows an empty state when no incidents exist", () => {
	render(<MemoryRouter><IncidentList incidents={[]} /></MemoryRouter>);
	expect(screen.getByText(/no reports yet/i)).toBeInTheDocument();
});

test("renders an incident summary and status", () => {
	render(<MemoryRouter><IncidentList incidents={[{ id: 4, title: "Road collision", description: "A collision near CBD", type: "Accident", status: "under_investigation", location_address: "Kenyatta Avenue" }]} /></MemoryRouter>);
	expect(screen.getByRole("heading", { name: "Road collision" })).toBeInTheDocument();
	expect(screen.getByText(/under investigation/i)).toBeInTheDocument();
});
