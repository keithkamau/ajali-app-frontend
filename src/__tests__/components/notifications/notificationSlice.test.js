import notificationReducer, {
  clearError,
  markAllAsRead,
  markAsRead,
  removeNotification,
  clearAllNotifications,
  fetchNotifications,
  fetchUnreadCount,
  fetchPreferences,
  updatePreferences,
} from "../../../redux/slices/notificationSlice";

const makeNotif = (overrides = {}) => ({
  id: 1,
  user_id: 10,
  type: "status_change",
  title: "Incident Updated",
  message: "Status changed to Under Investigation.",
  data: null,
  read: false,
  created_at: "2026-08-20T10:00:00",
  ...overrides,
});

describe("notificationSlice reducer", () => {
  const initial = {
    notifications: [],
    unread_count: 0,
    preferences: { email_enabled: true, sms_enabled: true, push_enabled: false },
    loading: false,
    error: null,
  };

  test("returns initial state", () => {
    expect(notificationReducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  test("clearError sets error to null", () => {
    const state = { ...initial, error: "Something went wrong." };
    expect(notificationReducer(state, clearError()).error).toBeNull();
  });

  test("fetchNotifications.pending sets loading", () => {
    const state = notificationReducer(initial, fetchNotifications.pending("", {}));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test("fetchNotifications.fulfilled sets notifications", () => {
    const n = makeNotif();
    const action = fetchNotifications.fulfilled({ notifications: [n] }, "", {});
    const state = notificationReducer(initial, action);
    expect(state.loading).toBe(false);
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0].title).toBe("Incident Updated");
  });

  test("fetchNotifications.rejected sets error", () => {
    const action = fetchNotifications.rejected(
      new Error("Network error"),
      "",
      {},
      "Network error"
    );
    const state = notificationReducer(initial, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });

  test("fetchUnreadCount.fulfilled updates unread_count", () => {
    const action = fetchUnreadCount.fulfilled({ unread_count: 5 }, "", undefined);
    expect(notificationReducer(initial, action).unread_count).toBe(5);
  });

  test("markAsRead.fulfilled marks notification read and decrements count", () => {
    const n = makeNotif({ id: 1, read: false });
    const state = { ...initial, notifications: [n], unread_count: 1 };
    const updated = { ...n, read: true };
    const action = markAsRead.fulfilled({ notification: updated }, "", 1);
    const next = notificationReducer(state, action);
    expect(next.notifications[0].read).toBe(true);
    expect(next.unread_count).toBe(0);
  });

  test("markAsRead.fulfilled does not go below 0", () => {
    const n = makeNotif({ id: 1, read: false });
    const state = { ...initial, notifications: [n], unread_count: 0 };
    const action = markAsRead.fulfilled({ notification: { ...n, read: true } }, "", 1);
    expect(notificationReducer(state, action).unread_count).toBe(0);
  });

  test("markAllAsRead.fulfilled marks all read and zeroes count", () => {
    const state = {
      ...initial,
      notifications: [makeNotif({ id: 1 }), makeNotif({ id: 2 })],
      unread_count: 2,
    };
    const action = markAllAsRead.fulfilled({ message: "ok" }, "", undefined);
    const next = notificationReducer(state, action);
    expect(next.unread_count).toBe(0);
    next.notifications.forEach((n) => expect(n.read).toBe(true));
  });

  test("fetchPreferences.fulfilled stores preferences", () => {
    const prefs = { email_enabled: false, sms_enabled: true, push_enabled: false };
    const action = fetchPreferences.fulfilled({ preferences: prefs }, "", undefined);
    expect(notificationReducer(initial, action).preferences.email_enabled).toBe(false);
  });

  test("updatePreferences.fulfilled updates preferences", () => {
    const prefs = { email_enabled: false, sms_enabled: false, push_enabled: false };
    const action = updatePreferences.fulfilled({ preferences: prefs }, "", prefs);
    expect(notificationReducer(initial, action).preferences.sms_enabled).toBe(false);
  });

  test("removeNotification.fulfilled removes item and decrements if unread", () => {
    const state = {
      ...initial,
      notifications: [makeNotif({ id: 1, read: false }), makeNotif({ id: 2, read: true })],
      unread_count: 1,
    };
    const action = removeNotification.fulfilled({ message: "ok" }, "", 1);
    const next = notificationReducer(state, action);
    expect(next.notifications).toHaveLength(1);
    expect(next.unread_count).toBe(0);
  });

  test("clearAllNotifications.fulfilled empties state", () => {
    const state = {
      ...initial,
      notifications: [makeNotif()],
      unread_count: 1,
    };
    const action = clearAllNotifications.fulfilled({ message: "ok" }, "", undefined);
    const next = notificationReducer(state, action);
    expect(next.notifications).toHaveLength(0);
    expect(next.unread_count).toBe(0);
  });
});
