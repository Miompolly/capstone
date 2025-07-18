from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Booking
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Manage booking approvals and denials for mentors'

    def add_arguments(self, parser):
        parser.add_argument(
            '--mentor-email',
            type=str,
            help='Email of the mentor to manage bookings for',
            required=True
        )
        parser.add_argument(
            '--action',
            type=str,
            choices=['list', 'approve', 'deny'],
            help='Action to perform: list, approve, or deny',
            required=True
        )
        parser.add_argument(
            '--booking-id',
            type=int,
            help='ID of the booking to approve/deny (required for approve/deny actions)'
        )

    def handle(self, *args, **options):
        mentor_email = options['mentor_email']
        action = options['action']
        booking_id = options.get('booking_id')

        try:
            mentor = User.objects.get(email=mentor_email, role__in=['mentor', 'Mentor'])
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Mentor with email {mentor_email} not found')
            )
            return

        if action == 'list':
            self.list_bookings(mentor)
        elif action in ['approve', 'deny']:
            if not booking_id:
                self.stdout.write(
                    self.style.ERROR('--booking-id is required for approve/deny actions')
                )
                return
            self.handle_booking_decision(mentor, booking_id, action)

    def list_bookings(self, mentor):
        """List all bookings for the mentor"""
        bookings = Booking.objects.filter(mentor=mentor).order_by('-created_at')
        
        if not bookings.exists():
            self.stdout.write(
                self.style.WARNING(f'No bookings found for mentor {mentor.name}')
            )
            return

        self.stdout.write(
            self.style.SUCCESS(f'\nBookings for {mentor.name} ({mentor.email}):')
        )
        self.stdout.write('-' * 80)
        
        for booking in bookings:
            status_color = self.get_status_color(booking.status)
            self.stdout.write(
                f'ID: {booking.id} | '
                f'Mentee: {booking.mentee.name} | '
                f'Date: {booking.day} | '
                f'Time: {booking.time or "Not specified"} | '
                f'Status: {status_color(booking.status.upper())} | '
                f'Title: {booking.title or "No title"}'
            )
            if booking.note:
                self.stdout.write(f'  Note: {booking.note}')
            self.stdout.write('')

    def handle_booking_decision(self, mentor, booking_id, action):
        """Approve or deny a booking"""
        try:
            booking = Booking.objects.get(id=booking_id, mentor=mentor)
        except Booking.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Booking with ID {booking_id} not found for this mentor')
            )
            return

        if not booking.is_pending():
            self.stdout.write(
                self.style.WARNING(
                    f'Booking {booking_id} is already {booking.status}. '
                    'Only pending bookings can be approved/denied.'
                )
            )
            return

        if action == 'approve':
            success = booking.approve()
            if success:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Booking {booking_id} with {booking.mentee.name} has been APPROVED'
                    )
                )
                self.show_booking_details(booking)
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to approve booking {booking_id}')
                )
        
        elif action == 'deny':
            success = booking.deny()
            if success:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Booking {booking_id} with {booking.mentee.name} has been DENIED'
                    )
                )
                self.show_booking_details(booking)
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to deny booking {booking_id}')
                )

    def show_booking_details(self, booking):
        """Show detailed booking information"""
        self.stdout.write('\nBooking Details:')
        self.stdout.write(f'  Mentee: {booking.mentee.name} ({booking.mentee.email})')
        self.stdout.write(f'  Date: {booking.day}')
        self.stdout.write(f'  Time: {booking.time or "Not specified"}')
        self.stdout.write(f'  Title: {booking.title or "No title"}')
        if booking.note:
            self.stdout.write(f'  Note: {booking.note}')
        self.stdout.write(f'  Status: {booking.status.upper()}')
        self.stdout.write(f'  Created: {booking.created_at.strftime("%Y-%m-%d %H:%M")}')
        self.stdout.write(f'  Updated: {booking.updated_at.strftime("%Y-%m-%d %H:%M")}')

    def get_status_color(self, status):
        """Get colored output for status"""
        if status == 'approved':
            return self.style.SUCCESS
        elif status == 'denied':
            return self.style.ERROR
        elif status == 'pending':
            return self.style.WARNING
        else:
            return self.style.NOTICE
