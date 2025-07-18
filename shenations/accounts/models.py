from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings

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

    @property
    def status_display(self):
        """Get human-readable status"""
        return dict(self.STATUS_CHOICES).get(self.status, self.status)

    def save(self, *args, **kwargs):
        """Override save to send email notifications for new bookings"""
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Send email notification for new booking requests
        if is_new and self.status == 'pending':
            try:
                from .services import BookingNotificationService
                BookingNotificationService.send_new_booking_request_email(self)
            except ImportError:
                pass  # Service not available
