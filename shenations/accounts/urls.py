# accounts/urls.py
from django.urls import path
from .views import (
    BookMentorView, MentorBookingsListView, MenteeBookingsListView, BookingDetailView, BookingDecisionView, BulkBookingActionsView, BookingAnalyticsView,
    MentorCalendarBookingsAPIView, RegisterView, LoginView, MentorListAPIView,
    VerifyUserView, GetAllUsersView, UserDetailView,
    UserProfileView, UserProfileUpdateView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='jwt_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('mentors/', MentorListAPIView.as_view(), name='mentor-list'),
    path('verify-user/', VerifyUserView.as_view(), name='verify-user'),
    path('all-users/', GetAllUsersView.as_view(), name='get_all_users'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('mentors/book/', BookMentorView.as_view(), name='book-mentor'),
    path('calendar/bookings/', MentorCalendarBookingsAPIView.as_view(), name='mentor_calendar_bookings'),
    path('mentor/bookings/', MentorBookingsListView.as_view(), name='mentor-bookings'),
    path('mentee/bookings/', MenteeBookingsListView.as_view(), name='mentee-bookings'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/decide/', BookingDecisionView.as_view(), name='booking-decision'),
    path('bookings/bulk-actions/', BulkBookingActionsView.as_view(), name='bulk-booking-actions'),
    path('bookings/analytics/', BookingAnalyticsView.as_view(), name='booking-analytics'),
]
