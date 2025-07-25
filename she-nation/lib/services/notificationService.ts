import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export interface Notification {
  id: string;
  type:
    | "booking_approved"
    | "booking_denied"
    | "new_booking_request"
    | "booking_deleted";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  lastChecked: string | null;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: Set<(notifications: NotificationState) => void> =
    new Set();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private lastChecked: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(callback: (notifications: NotificationState) => void): () => void {
    this.listeners.add(callback);

    // Start polling when first subscriber is added
    if (this.listeners.size === 1 && !this.isPolling) {
      this.startPolling();
    }

    return () => {
      this.listeners.delete(callback);

      // Stop polling when no subscribers
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  private notify(state: NotificationState) {
    this.listeners.forEach((callback) => callback(state));
  }

  private async fetchNotifications(): Promise<NotificationState> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

      // Import the token utility function
      const { getAuthToken } = await import("@/lib/auth/auth-service");
      const token = getAuthToken();

      if (!token) {
        return { notifications: [], unreadCount: 0, lastChecked: null };
      }

      // For now, we'll simulate notifications based on recent bookings
      // In a real implementation, you'd have a dedicated notifications endpoint
      const response = await fetch(`${baseUrl}/api/auth/mentor/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const bookings = await response.json();
      const notifications = this.generateNotificationsFromBookings(bookings);

      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { notifications: [], unreadCount: 0, lastChecked: null };
    }
  }

  private generateNotificationsFromBookings(bookings: any[]): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    bookings.forEach((booking) => {
      const updatedAt = new Date(booking.updated_at);
      const createdAt = new Date(booking.created_at);

      // New booking requests (created in last hour)
      if (createdAt > oneHourAgo && booking.status === "pending") {
        notifications.push({
          id: `new_booking_${booking.id}`,
          type: "new_booking_request",
          title: "New Booking Request",
          message: `${booking.mentee} has requested a session for ${new Date(
            booking.day
          ).toLocaleDateString()}`,
          timestamp: booking.created_at,
          read: false,
          data: { bookingId: booking.id, mentee: booking.mentee },
        });
      }

      // Status changes (updated in last hour, but not just created)
      if (
        updatedAt > oneHourAgo &&
        updatedAt > createdAt &&
        booking.status !== "pending"
      ) {
        const isApproved = booking.status === "approved";
        notifications.push({
          id: `status_change_${booking.id}`,
          type: isApproved ? "booking_approved" : "booking_denied",
          title: isApproved ? "Booking Approved" : "Booking Denied",
          message: `You ${isApproved ? "approved" : "denied"} ${
            booking.mentee
          }'s booking request`,
          timestamp: booking.updated_at,
          read: false,
          data: {
            bookingId: booking.id,
            mentee: booking.mentee,
            status: booking.status,
          },
        });
      }
    });

    return notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private startPolling() {
    if (this.isPolling) return;

    this.isPolling = true;

    // Initial fetch
    this.fetchNotifications().then((state) => {
      this.lastChecked = state.lastChecked;
      this.notify(state);
    });

    // Poll every 30 seconds
    this.pollingInterval = setInterval(async () => {
      const state = await this.fetchNotifications();

      // Show toast notifications for new items
      if (this.lastChecked) {
        const newNotifications = state.notifications.filter(
          (n) => new Date(n.timestamp) > new Date(this.lastChecked!)
        );

        newNotifications.forEach((notification) => {
          this.showToastNotification(notification);
        });
      }

      this.lastChecked = state.lastChecked;
      this.notify(state);
    }, 30000); // 30 seconds
  }

  private stopPolling() {
    this.isPolling = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private showToastNotification(notification: Notification) {
    const toastOptions = {
      duration: 5000,
      position: "top-right" as const,
    };

    switch (notification.type) {
      case "new_booking_request":
        toast.success(notification.message, {
          ...toastOptions,
          icon: "📅",
        });
        break;
      case "booking_approved":
        toast.success(notification.message, {
          ...toastOptions,
          icon: "✅",
        });
        break;
      case "booking_denied":
        toast.error(notification.message, {
          ...toastOptions,
          icon: "❌",
        });
        break;
      default:
        toast(notification.message, toastOptions);
    }
  }

  markAsRead(notificationId: string) {
    // In a real implementation, this would make an API call
    // For now, we'll just trigger a refresh
    this.fetchNotifications().then((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );

      this.notify({
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      });
    });
  }

  markAllAsRead() {
    // In a real implementation, this would make an API call
    this.fetchNotifications().then((state) => {
      const updatedNotifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));

      this.notify({
        ...state,
        notifications: updatedNotifications,
        unreadCount: 0,
      });
    });
  }
}

// React hook for using notifications
export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    lastChecked: null,
  });

  useEffect(() => {
    const service = NotificationService.getInstance();
    const unsubscribe = service.subscribe(setState);

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    NotificationService.getInstance().markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    NotificationService.getInstance().markAllAsRead();
  };

  return {
    ...state,
    markAsRead,
    markAllAsRead,
  };
}

// Hook for showing real-time toast notifications
export function useRealtimeToasts() {
  const notificationServiceRef = useRef<NotificationService>();

  useEffect(() => {
    notificationServiceRef.current = NotificationService.getInstance();

    // Start the service (it will only start if there are subscribers)
    const unsubscribe = notificationServiceRef.current.subscribe(() => {
      // We don't need to do anything here, the service handles toasts internally
    });

    return unsubscribe;
  }, []);
}

export default NotificationService;
