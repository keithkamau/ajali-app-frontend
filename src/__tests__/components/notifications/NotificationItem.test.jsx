import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../../../redux/slices/notificationSlice";
import NotificationItem from "../../../components/notifications/NotificationItem";

jest.mock("../../../api/notificationApi", () => ({
  getNotifications: jest.fn(),
  getUnreadCount: jest.fn(),
  markAsRead: jest.fn().mockResolvedValue({ notification: { id: 1, read: true, type: "status_change", title: "T", message: "M", created_at: "2026-08-20T10:00:00" } }),
  markAllAsRead: jest.fn(),
  getPreferences: jest.fn(),
  updatePreferences: jest.fn(),
  deleteNotification: jest.fn().mockResolvedValue({ message: "Deleted" }),
  deleteAllNotifications: jest.fn(),
}));

const makeNotif = (overrides = {}) => ({
  id: 1,
  type: "status_change",
  title: "Incident Status Updated",
  message: "Your incident status changed from Draft to Under Investigation.",
  data: null,
  read: false,
  created_at: "2026-08-20T10:00:00",
  ...overrides,
});

function renderItem(notification) {
  const store = configureStore({
    reducer: { notifications: notificationReducer },
    preloadedState: {
      notifications: {
        notifications: [notification],
        unread_count: notification.read ? 0 : 1,
        preferences: {},
        loading: false,
        error: null,
      },
    },
  });
  return { store, ...render(<Provider store={store}><NotificationItem notification={notification} /></Provider>) };
}

test("renders notification title and message", () => {
  renderItem(makeNotif());
  expect(screen.getByText("Incident Status Updated")).toBeInTheDocument();
  expect(screen.getByText(/status changed from Draft/i)).toBeInTheDocument();
});

test("dispatches markAsRead when unread item is clicked", async () => {
  const user = userEvent.setup();
  const { store } = renderItem(makeNotif({ id: 1, read: false }));
  const btn = screen.getByRole("button", { name: /incident status updated/i });
  await user.click(btn);
  const state = store.getState().notifications;
  expect(state.notifications[0].read).toBe(true);
});

test("does not dispatch markAsRead when already read", async () => {
  const { markAsRead } = await import("../../../api/notificationApi");
  markAsRead.mockClear();
  const user = userEvent.setup();
  renderItem(makeNotif({ read: true }));
  await user.click(screen.getByRole("button", { name: /incident status updated/i }));
  expect(markAsRead).not.toHaveBeenCalled();
});

test("delete button dispatches removeNotification", async () => {
  const user = userEvent.setup();
  const { store } = renderItem(makeNotif({ id: 1 }));
  await user.click(screen.getByRole("button", { name: /delete notification/i }));
  expect(store.getState().notifications.notifications).toHaveLength(0);
});

test("unread indicator is visible for unread notifications", () => {
  const { container } = renderItem(makeNotif({ read: false }));
  const indicator = container.querySelector('[aria-hidden="true"][style*="border-radius: 50%"]');
  expect(indicator).toBeInTheDocument();
});
