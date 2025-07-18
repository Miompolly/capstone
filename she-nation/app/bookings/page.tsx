import { AuthGuard } from "@/components/auth/auth-guard"
import { BookingCalendar } from "@/components/mentorship/booking-calendar"

export const metadata = {
  title: "My Bookings - SheNation",
  description: "View and manage your mentor bookings",
}

export default function BookingsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BookingCalendar />
        </div>
      </div>
    </AuthGuard>
  )
}
