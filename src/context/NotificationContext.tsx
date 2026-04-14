import React, { createContext, useContext, useState } from "react";

interface Notification {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (msg: string, type?: Notification["type"]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: Notification["type"] = "info") => {
    const id = Date.now();

    const newNotif: Notification = { id, message, type };

    // 🔥 Add to UI
    setNotifications((prev) => [newNotif, ...prev]);

    // 🔥 Save history
    const saved = JSON.parse(localStorage.getItem("notif_history") || "[]");
    localStorage.setItem("notif_history", JSON.stringify([newNotif, ...saved]));

    // 🔥 Auto remove (floating only)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};