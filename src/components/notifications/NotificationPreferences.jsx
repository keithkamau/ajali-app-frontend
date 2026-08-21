import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreferences, updatePreferences } from "../../redux/slices/notificationSlice";
import EmailPreference from "./EmailPreference";
import SMSPreference from "./SMSPreference";

export default function NotificationPreferences() {
  const dispatch = useDispatch();
  const { preferences } = useSelector((s) => s.notifications);
  const user = useSelector((s) => s.auth?.user);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  function handleChange(key, value) {
    dispatch(updatePreferences({ ...preferences, [key]: value })).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: "20px" }}>Notification Preferences</h2>
      <p style={{ margin: "0 0 24px", color: "#888", fontSize: "14px" }}>
        Choose how you want to be notified about your incident reports.
      </p>
      <EmailPreference
        email={user?.email}
        enabled={preferences.email_enabled ?? true}
        onChange={(val) => handleChange("email_enabled", val)}
      />
      <SMSPreference
        phone={user?.phone_number}
        enabled={preferences.sms_enabled ?? true}
        onChange={(val) => handleChange("sms_enabled", val)}
      />
      {saved && (
        <p style={{ marginTop: "16px", color: "#2e7d32", fontSize: "14px", fontWeight: 500 }}>
          Preferences saved.
        </p>
      )}
    </div>
  );
}
