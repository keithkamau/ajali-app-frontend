// src/utils/mockData.js
export const mockIncidents = [
  {
    id: 1,
    reference: "A/J-2024-0001",
    title: "Two-car collision on Thika Road",
    description:
      "A serious accident involving a matatu and a private car near the Kenyatta University turnoff. Emergency services have been dispatched.",
    type: "accident",
    status: "pending",
    location: {
      lat: -1.2345,
      lng: 36.8765,
      address: "Thika Road, near Kenyatta University",
    },
    created_at: "2024-12-10T14:30:00Z",
    updated_at: "2024-12-10T14:30:00Z",
    images: [],
    videos: [],
    isAnonymous: false,
  },
  {
    id: 2,
    reference: "A/J-2024-0002",
    title: "Building Fire in CBD",
    description:
      "A fire outbreak at a commercial building on Moi Avenue. Fire engines are on site.",
    type: "emergency",
    status: "under_investigation",
    location: {
      lat: -1.2864,
      lng: 36.8172,
      address: "Moi Avenue, Nairobi CBD",
    },
    created_at: "2024-12-09T09:15:00Z",
    updated_at: "2024-12-09T11:45:00Z",
    images: [],
    videos: [],
    isAnonymous: false,
  },
  {
    id: 3,
    reference: "A/J-2024-0003",
    title: "Pedestrian Hit on Ngong Road",
    description:
      "A pedestrian was hit by a speeding motorcycle near the junction. Ambulance has been called.",
    type: "accident",
    status: "resolved",
    location: {
      lat: -1.3245,
      lng: 36.789,
      address: "Ngong Road, near Adams Arcade",
    },
    created_at: "2024-12-08T18:20:00Z",
    updated_at: "2024-12-09T08:00:00Z",
    images: [],
    videos: [],
    isAnonymous: true,
  },
  {
    id: 4,
    reference: "A/J-2024-0004",
    title: "Gas Leak Reported in Industrial Area",
    description:
      "Residents reported a strong gas smell coming from a factory. Fire department has been alerted.",
    type: "emergency",
    status: "rejected",
    location: {
      lat: -1.3098,
      lng: 36.8456,
      address: "Industrial Area, Nairobi",
    },
    created_at: "2024-12-07T07:00:00Z",
    updated_at: "2024-12-07T09:30:00Z",
    images: [],
    videos: [],
    isAnonymous: false,
  },
  {
    id: 5,
    reference: "A/J-2024-0005",
    title: "Multi-Vehicle Accident on Mombasa Road",
    description:
      "Five vehicles involved in a pileup near the airport junction. Heavy traffic and injuries reported.",
    type: "accident",
    status: "pending",
    location: {
      lat: -1.3567,
      lng: 36.8901,
      address: "Mombasa Road, near Jomo Kenyatta International Airport",
    },
    created_at: "2024-12-06T16:45:00Z",
    updated_at: "2024-12-06T16:45:00Z",
    images: [],
    videos: [],
    isAnonymous: false,
  },
  {
    id: 6,
    reference: "A/J-2024-0006",
    title: "Suspicious Package at Bus Station",
    description:
      "Police have cordoned off the area after a suspicious package was found at the bus station.",
    type: "emergency",
    status: "under_investigation",
    location: {
      lat: -1.2912,
      lng: 36.8234,
      address: "Nairobi Bus Station, City Centre",
    },
    created_at: "2024-12-05T11:00:00Z",
    updated_at: "2024-12-05T13:20:00Z",
    images: [],
    videos: [],
    isAnonymous: true,
  },
];

export const mockStats = {
  total: 128,
  inProgress: 34,
  resolved: 94,
  sosAlerts: 12,
};

export const mockNotifications = [
  {
    id: 1,
    title: "Status Update",
    message: "Your report A/J-2024-0003 has been resolved",
    read: false,
    created_at: "2024-12-10T08:00:00Z",
    link: "/incidents/3",
  },
  {
    id: 2,
    title: "New Comment",
    message: "Responders have added a comment to your report A/J-2024-0002",
    read: false,
    created_at: "2024-12-09T14:30:00Z",
    link: "/incidents/2",
  },
  {
    id: 3,
    title: "Status Update",
    message: "Your report A/J-2024-0004 has been rejected",
    read: true,
    created_at: "2024-12-07T10:00:00Z",
    link: "/incidents/4",
  },
];

export const mockUsers = [
  {
    id: 1,
    email: 'user@ajali.com',
    password: 'Password123',
    full_name: 'Test User',
    phone_number: '0712345678',
    role: 'user',
    is_active: true,
    is_verified: true,
  },
  {
    id: 2,
    email: 'admin@ajali.com',
    password: 'Admin123',
    full_name: 'Admin User',
    phone_number: '0712345679',
    role: 'admin',
    is_active: true,
    is_verified: true,
  },
];