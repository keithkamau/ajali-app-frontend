import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../../../redux/slices/notificationSlice";

jest.mock("../../../api/notificationApi", () => ({
  getNotifications: jest.fn().mockResolvedValue({ notifications: [] }),
  getUnreadCount: jest.fn().mockResolvedValue({ unread_count: 0 }),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  getPreferences: jest.fn(),
  updatePreferences: jest.fn(),
  deleteNotification: jest.fn(),
  deleteAllNotifications: jest.fn(),
}));

import NotificationBell from "../../../components/notifications/NotificationBell";

function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: { notifications: notificationReducer },
    preloadedState,
  });
}

function renderBell(state = {}) {
  const store = makeStore(state);
  return render(
    <Provider store={store}>
      <NotificationBell />
    </Provider>
  );
}

test("renders bell button with accessible label", () => {
  renderBell();
  expect(screen.getByRole("button", { name: /notifications/i })).toBeInTheDocument();
});

test("shows no badge when unread_count is 0", () => {
  renderBell({ notifications: { notifications: [], unread_count: 0, preferences: {}, loading: false, error: null } });
  expect(screen.queryByText("0")).not.toBeInTheDocument();
});

test("shows badge with unread count", () => {
  renderBell({
    notifications: { notifications: [], unread_count: 3, preferences: {}, loading: false, error: null },
  });
  expect(screen.getByText("3")).toBeInTheDocument();
});

test("shows 99+ for counts above 99", () => {
  renderBell({
    notifications: { notifications: [], unread_count: 150, preferences: {}, loading: false, error: null },
  });
  expect(screen.getByText("99+")).toBeInTheDocument();
});

test("toggles notification panel on click", async () => {
  const user = userEvent.setup();
  renderBell({
    notifications: { notifications: [], unread_count: 0, preferences: {}, loading: false, error: null },
  });
  const btn = screen.getByRole("button", { name: /notifications/i });
  await user.click(btn);
  expect(screen.getByRole("dialog", { name: /notifications panel/i })).toBeInTheDocument();
  await user.click(btn);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("aria-label includes unread count when non-zero", () => {
  renderBell({
    notifications: { notifications: [], unread_count: 2, preferences: {}, loading: false, error: null },
  });
  expect(screen.getByRole("button", { name: /2 unread/i })).toBeInTheDocument();
});
