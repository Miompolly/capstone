import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: "1",
      title: "New Mentorship Session",
      message: "Your session with Dr. Emily Chen is scheduled for tomorrow at 2:00 PM",
      type: "info",
      read: false,
      createdAt: "2024-01-20T10:00:00Z",
    },
    {
      id: "2",
      title: "Course Progress",
      message: "Congratulations! You've completed 65% of Leadership in Tech course",
      type: "success",
      read: false,
      createdAt: "2024-01-19T15:30:00Z",
    },
    {
      id: "3",
      title: "New Job Match",
      message: "We found 3 new job opportunities that match your profile",
      type: "info",
      read: true,
      createdAt: "2024-01-18T09:15:00Z",
    },
  ],
  unreadCount: 2,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "createdAt">>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.notifications.unshift(newNotification)
      if (!newNotification.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true))
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions
export default notificationsSlice.reducer
