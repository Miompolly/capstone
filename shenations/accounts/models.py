from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings
import hashlib

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    role = models.CharField(max_length=50)
    education_level = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)  # Required for admin
    date_registered = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
    profile_picture_url = models.URLField(blank=True, null=True)
    resume_url = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    sessions_completed = models.PositiveIntegerField(default=0)
    years_experience = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)

    def __str__(self):
        return f"{self.user.name}'s Profile"



class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('cancelled', 'Cancelled'),
    ]

    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_bookings'
    )
    mentee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentee_bookings'
    )
    day = models.DateField()
    time = models.TimeField(null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    meeting_batch = models.IntegerField(null=True, blank=True)
    google_meet_link = models.URLField(max_length=200, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['mentor', 'status']),
            models.Index(fields=['mentee', 'status']),
            models.Index(fields=['day']),
        ]

    def __str__(self):
        return f"{self.mentee} booked {self.mentor} on {self.day} at {self.time or 'N/A'} - {self.title or 'No Title'} ({self.status})"

    def approve(self, approved_by=None, send_email=True):
        """Approve the booking session"""
        if self.status == 'pending':
            self.status = 'approved'
            self.save()

            # Send email notification
            if send_email:
                try:
                    from .services import BookingNotificationService
                    BookingNotificationService.send_booking_approved_email(self)
                except ImportError:
                    pass  # Service not available

            return True
        return False

    def deny(self, denied_by=None, send_email=True):
        """Deny the booking session"""
        if self.status == 'pending':
            self.status = 'denied'
            self.save()

            # Send email notification
            if send_email:
                try:
                    from .services import BookingNotificationService
                    BookingNotificationService.send_booking_denied_email(self)
                except ImportError:
                    pass  # Service not available

            return True
        return False

    def cancel(self, cancelled_by=None, send_email=True):
        """Cancel the booking session"""
        if self.status in ['pending', 'approved']:
            self.status = 'cancelled'
            self.save()

            # Send email notification
            if send_email:
                try:
                    from .services import BookingNotificationService
                    # Note: send_booking_cancelled_email method not implemented yet
                    # BookingNotificationService.send_booking_cancelled_email(self)
                    pass
                except ImportError:
                    pass  # Service not available

            return True
        return False

    def can_be_modified_by(self, user):
        """Check if user can modify this booking"""
        return user == self.mentor or user.role == 'admin'

    def is_pending(self):
        """Check if booking is pending approval"""
        return self.status == 'pending'

    def is_approved(self):
        """Check if booking is approved"""
        return self.status == 'approved'

    def is_denied(self):
        """Check if booking is denied"""
        return self.status == 'denied'

    def is_cancelled(self):
        """Check if booking is cancelled"""
        return self.status == 'cancelled'

    @property
    def status_display(self):
        """Get human-readable status"""
        return dict(self.STATUS_CHOICES).get(self.status, self.status)

    def generate_meet_link(self):
        if not self.meeting_batch:
            return None
        # Create a unique hash based on mentor ID and batch number
        hash_input = f"{self.mentor.id}-{self.meeting_batch}"
        hash_object = hashlib.sha256(hash_input.encode())
        meet_code = hash_object.hexdigest()[:10]
        return f"https://meet.google.com/{meet_code}"

    def save(self, *args, **kwargs):
        # Check if this is a new booking
        is_new = self._state.adding
        
        # Handle batch/meet link generation for approved status
        if self.status == 'approved' and not self.google_meet_link:
            # Get the latest batch number for this mentor
            latest_batch = Booking.objects.filter(
                mentor=self.mentor,
                meeting_batch__isnull=False
            ).order_by('-meeting_batch').first()

            # Get count of approved bookings in the latest batch
            if latest_batch and latest_batch.meeting_batch:
                batch_count = Booking.objects.filter(
                    mentor=self.mentor,
                    meeting_batch=latest_batch.meeting_batch
                ).count()

                if batch_count < 10:
                    self.meeting_batch = latest_batch.meeting_batch
                else:
                    self.meeting_batch = (latest_batch.meeting_batch or 0) + 1
            else:
                self.meeting_batch = 1

            self.google_meet_link = self.generate_meet_link()

        # Handle initial pending status
        if is_new and self.status == 'pending':
            # Send notification email to mentor
            try:
                subject = "New Booking Request"
                message = f"You have a new booking request from {self.mentee.name}"
                from_email = settings.DEFAULT_FROM_EMAIL
                recipient_list = [self.mentor.email]
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print(f"Error sending email: {e}")

        super().save(*args, **kwargs)
