from tokenize import generate_tokens
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from .models import Booking, User
from .serializers import AccountSerializer, BookingSerializer, MentorSerializer, RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import status, permissions
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer, UserProfileSerializer


from rest_framework import generics, permissions
from .models import User
from .serializers import MentorSerializer

class MentorListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.filter(role='Mentor', is_active=True).select_related('profile')
    serializer_class = MentorSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = User.objects.create(
                name=data['name'],
                email=data['email'],
                password=make_password(data['password']),
                phone=data['phone'],
                location=data['location'],
                role=data['role'],
                education_level=data['education_level'],
                is_active=(data['role'] == 'admin')
            )

            message = (
                "Admin registered and activated successfully."
                if user.is_active else
                "User registered. Awaiting approval."
            )
            return Response({"message": message}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

            if not check_password(password, user.password):
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

            if not user.is_active:
                return Response({"error": "User is not active"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    'is_active': user.is_active,
                    "education_level": user.education_level,
                    "phone": user.phone,
                    "location": user.location,
                    "date_registered": user.date_registered.isoformat()
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.permissions import BasePermission
from django.core.mail import send_mail




User = get_user_model()


class VerifyUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only admin can verify users."},
                status=status.HTTP_403_FORBIDDEN
            )

        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {"detail": "User ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Activate the user
        user.is_active = True
        user.save()

        # Prepare HTML email
        subject = "✅ Your Account Has Been Verified"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]

        text_content = (
            f"Hello {user.name},\n\n"
            "Your account has been successfully verified and is now active.\n\n"
            "Thank you!"
        )

        html_content = f"""
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2e6c80;">Account Verified ✅</h2>
            <p>Hello <strong>{user.name}</strong>,</p>
            <p>Your account has been <span style="color: green;"><strong>successfully verified</strong></span> and is now active.</p>
            <p style="margin-top: 20px;">Thank you for joining our platform.</p>
            <p style="color: #888; font-size: 13px; margin-top: 30px;">This is an automated message. Please do not reply.</p>
        </div>
        """

        try:
            email = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
            email.attach_alternative(html_content, "text/html")
            email.send()
        except Exception as e:
            return Response(
                {"detail": "User verified, but email could not be sent.", "error": str(e)},
                status=status.HTTP_200_OK
            )

        return Response({
            "detail": f"User with ID {user.id} has been verified and notified via email.",
            "user_id": user.id,
            "email": user.email
        }, status=status.HTTP_200_OK)


class GetAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only admin can view all users."}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = AccountSerializer(users, many=True)
        return Response(serializer.data)
    


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def is_admin(self, user):
        return user.role == 'admin'

    def get(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can view user details.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can update users.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'User updated successfully.', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can delete users.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            profile = user.profile
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        except UserProfile.DoesNotExist:
            serializer = UserProfileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=user)
            return Response({"detail": "Profile saved successfully", "profile": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
class UserProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Profile updated successfully", "profile": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import BookingCreateSerializer


class BookMentorView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        mentor = booking.mentor
        if mentor and mentor.email:
            subject = "New Booking Received"
            message = (
                f"Hello {mentor.name},\n\n"
                f"You have received a new booking from {request.user.name}.\n"
                f"Please log in to your dashboard to view the details."
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [mentor.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            except Exception as e:
                print(f"Error sending booking email: {e}")

        return Response({
            "message": "Booking successfully created and mentor notified by email.",
            "booking": serializer.data,
        }, status=status.HTTP_201_CREATED)

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Booking

class MentorCalendarBookingsAPIView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow public access

    def get(self, request):
        mentor_id = request.query_params.get("mentor_id")

        if not mentor_id:
            return Response({"error": "mentor_id query parameter is required."}, status=400)

        bookings = Booking.objects.filter(mentor_id=mentor_id)

        data = []
        for booking in bookings:
            start_time = booking.time.isoformat() if booking.time else "00:00:00"
            data.append({
                "id": booking.id,
                "title": booking.title or "Mentorship Session",
                "start": f"{booking.day}T{start_time}",
                "end": f"{booking.day}T{start_time}",
                "note": booking.note,
                "mentor": str(booking.mentor),
                "mentee": str(booking.mentee),
            })

        return Response(data)
    
class MentorBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return bookings where the current user is the mentor
        return Booking.objects.filter(mentor=self.request.user)

class MenteeBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return bookings where the current user is the mentee
        return Booking.objects.filter(mentee=self.request.user)

class BookingDecisionView(APIView):
    """
    API view for mentors to approve or deny booking requests
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return None

    def post(self, request, pk):
        """
        Approve or deny a booking request
        Expected payload: {"action": "approve"} or {"action": "deny"}
        """
        booking = self.get_object(pk)
        if not booking:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Only the mentor can approve/deny their bookings
        if not booking.can_be_modified_by(request.user):
            return Response({
                'detail': 'Only the mentor can approve or deny this booking.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if booking is still pending
        if not booking.is_pending():
            return Response({
                'detail': f'Booking is already {booking.status}. Only pending bookings can be approved or denied.'
            }, status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get('action', '').lower()

        if action == 'approve':
            success = booking.approve(approved_by=request.user, send_email=True)
            if success:
                serializer = BookingSerializer(booking)
                return Response({
                    'detail': f'Booking with {booking.mentee.name} has been approved. Notification email sent.',
                    'booking': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'detail': 'Failed to approve booking.'
                }, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'deny':
            success = booking.deny(denied_by=request.user, send_email=True)
            if success:
                serializer = BookingSerializer(booking)
                return Response({
                    'detail': f'Booking with {booking.mentee.name} has been denied. Notification email sent.',
                    'booking': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'detail': 'Failed to deny booking.'
                }, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({
                'detail': 'Invalid action. Use "approve" or "deny".'
            }, status=status.HTTP_400_BAD_REQUEST)

class BookingDetailView(APIView):
    """
    API view for general booking management (update status, delete)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return None

    def put(self, request, pk):
        """Update booking status"""
        booking = self.get_object(pk)
        if not booking:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Only the mentor can update booking status
        if request.user != booking.mentor:
            return Response({'detail': 'Only the mentor can update booking status.'}, status=status.HTTP_403_FORBIDDEN)

        # Only allow status updates
        new_status = request.data.get('status')
        if new_status not in ['approved', 'denied']:
            return Response({'detail': 'Invalid status. Must be "approved" or "denied".'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        booking.save()

        serializer = BookingSerializer(booking)
        return Response({
            'detail': f'Booking {new_status} successfully.',
            'booking': serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete booking"""
        booking = self.get_object(pk)
        if not booking:
            return Response({'detail': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Both mentor and mentee can delete bookings
        if request.user != booking.mentor and request.user != booking.mentee:
            return Response({'detail': 'You can only delete your own bookings.'}, status=status.HTTP_403_FORBIDDEN)

        booking.delete()
        return Response({'detail': 'Booking deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class BulkBookingActionsView(APIView):
    """
    API view for bulk booking operations (approve/deny multiple bookings)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Perform bulk actions on multiple bookings
        Expected payload: {
            "action": "approve" | "deny",
            "booking_ids": [1, 2, 3, ...]
        }
        """
        action = request.data.get('action', '').lower()
        booking_ids = request.data.get('booking_ids', [])

        if action not in ['approve', 'deny']:
            return Response({
                'detail': 'Invalid action. Use "approve" or "deny".'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not booking_ids or not isinstance(booking_ids, list):
            return Response({
                'detail': 'booking_ids must be a non-empty list of booking IDs.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get bookings that belong to the current mentor
        bookings = Booking.objects.filter(
            id__in=booking_ids,
            mentor=request.user,
            status='pending'
        )

        if not bookings.exists():
            return Response({
                'detail': 'No pending bookings found for the provided IDs.'
            }, status=status.HTTP_404_NOT_FOUND)

        # Track results
        successful_updates = []
        failed_updates = []

        for booking in bookings:
            try:
                if action == 'approve':
                    success = booking.approve(approved_by=request.user, send_email=True)
                else:  # deny
                    success = booking.deny(denied_by=request.user, send_email=True)

                if success:
                    successful_updates.append({
                        'booking_id': booking.id,
                        'mentee_name': booking.mentee.name,
                        'status': booking.status
                    })
                else:
                    failed_updates.append({
                        'booking_id': booking.id,
                        'error': f'Failed to {action} booking'
                    })
            except Exception as e:
                failed_updates.append({
                    'booking_id': booking.id,
                    'error': str(e)
                })

        # Prepare response
        response_data = {
            'detail': f'Bulk {action} operation completed.',
            'successful_count': len(successful_updates),
            'failed_count': len(failed_updates),
            'successful_updates': successful_updates,
        }

        if failed_updates:
            response_data['failed_updates'] = failed_updates

        status_code = status.HTTP_200_OK if successful_updates else status.HTTP_400_BAD_REQUEST
        return Response(response_data, status=status_code)


class BookingAnalyticsView(APIView):
    """
    API view for booking analytics and statistics
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get booking analytics for the current mentor
        """
        # Only mentors and admins can access analytics
        if request.user.role not in ['mentor', 'Mentor', 'admin']:
            return Response({
                'detail': 'Only mentors can access booking analytics.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get all bookings for the mentor
        bookings = Booking.objects.filter(mentor=request.user)

        # Basic statistics
        total_bookings = bookings.count()
        pending_bookings = bookings.filter(status='pending').count()
        approved_bookings = bookings.filter(status='approved').count()
        denied_bookings = bookings.filter(status='denied').count()

        # Calculate approval rate
        processed_bookings = approved_bookings + denied_bookings
        approval_rate = (approved_bookings / processed_bookings * 100) if processed_bookings > 0 else 0

        # Monthly statistics (last 12 months)
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Count, Q
        from django.db.models.functions import TruncMonth

        twelve_months_ago = timezone.now() - timedelta(days=365)
        monthly_stats = bookings.filter(
            created_at__gte=twelve_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Count('id'),
            approved=Count('id', filter=Q(status='approved')),
            denied=Count('id', filter=Q(status='denied')),
            pending=Count('id', filter=Q(status='pending'))
        ).order_by('month')

        # Recent bookings (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_bookings = bookings.filter(created_at__gte=thirty_days_ago).count()

        # Top mentees (most bookings)
        from django.db.models import Count
        top_mentees = bookings.values(
            'mentee__name', 'mentee__email'
        ).annotate(
            booking_count=Count('id')
        ).order_by('-booking_count')[:5]

        # Booking status distribution
        status_distribution = {
            'pending': pending_bookings,
            'approved': approved_bookings,
            'denied': denied_bookings
        }

        # Response time analytics (average time to respond to bookings)
        processed_bookings_with_times = bookings.exclude(status='pending').exclude(updated_at__isnull=True)
        avg_response_time = None
        if processed_bookings_with_times.exists():
            from django.db.models import Avg, F
            avg_response_seconds = processed_bookings_with_times.aggregate(
                avg_time=Avg(F('updated_at') - F('created_at'))
            )['avg_time']
            if avg_response_seconds:
                avg_response_time = avg_response_seconds.total_seconds() / 3600  # Convert to hours

        # Prepare response data
        analytics_data = {
            'overview': {
                'total_bookings': total_bookings,
                'pending_bookings': pending_bookings,
                'approved_bookings': approved_bookings,
                'denied_bookings': denied_bookings,
                'approval_rate': round(approval_rate, 1),
                'recent_bookings_30_days': recent_bookings,
                'avg_response_time_hours': round(avg_response_time, 1) if avg_response_time else None
            },
            'status_distribution': status_distribution,
            'monthly_trends': list(monthly_stats),
            'top_mentees': list(top_mentees),
            'generated_at': timezone.now().isoformat()
        }

        return Response(analytics_data, status=status.HTTP_200_OK)