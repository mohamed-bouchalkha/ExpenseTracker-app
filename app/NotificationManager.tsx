import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const setupNotifications = async () => {
      await requestPermissions();
      await scheduleDailyNotification();
    };

    setupNotifications();
  }, []);
    
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    console.log("Notification permission status:", status); // Log the status
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log("Updated permission status:", newStatus); // Log the updated status
    }
  };
  

  const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear any existing notifications
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget to enter your expenses!",
        body: "Take a moment to log today's expenses before the day ends.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 23, // Schedule the notification for 11 PM
        minute:0, // Repeat the notification every day
      },
    });
    console.log("Daily notification scheduled for 11 PM.");
  };
  
  
  return <>{children}</>; // Render the rest of the app
};

export default NotificationProvider;
