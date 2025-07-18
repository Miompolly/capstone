from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Booking
from django.utils import timezone
from datetime import date, time

User = get_user_model()


class Command(BaseCommand):
    help = 'Test the booking system functionality'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing Booking System...'))
        
        # Test 1: Check if Booking model has all required fields
        self.stdout.write('\n1. Testing Booking model fields...')
        try:
            # Check if status field exists
            booking_fields = [field.name for field in Booking._meta.fields]
            self.stdout.write(f'Booking fields: {booking_fields}')
            
            required_fields = ['status', 'created_at', 'updated_at']
            missing_fields = [field for field in required_fields if field not in booking_fields]
            
            if missing_fields:
                self.stdout.write(
                    self.style.ERROR(f'Missing fields: {missing_fields}')
                )
                self.stdout.write(
                    self.style.WARNING('Run: python manage.py migrate')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS('✓ All required fields present')
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error checking model fields: {e}')
            )
        
        # Test 2: Check if users exist
        self.stdout.write('\n2. Testing user accounts...')
        try:
            mentors = User.objects.filter(role__in=['mentor', 'Mentor'])
            mentees = User.objects.filter(role='mentee')
            
            self.stdout.write(f'Mentors found: {mentors.count()}')
            self.stdout.write(f'Mentees found: {mentees.count()}')
            
            if mentors.count() == 0:
                self.stdout.write(
                    self.style.WARNING('No mentors found. Create a mentor user first.')
                )
            
            if mentees.count() == 0:
                self.stdout.write(
                    self.style.WARNING('No mentees found. Create a mentee user first.')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error checking users: {e}')
            )
        
        # Test 3: Create a test booking
        self.stdout.write('\n3. Testing booking creation...')
        try:
            mentors = User.objects.filter(role__in=['mentor', 'Mentor'])
            mentees = User.objects.filter(role='mentee')
            
            if mentors.exists() and mentees.exists():
                mentor = mentors.first()
                mentee = mentees.first()
                
                # Create test booking
                test_booking = Booking.objects.create(
                    mentor=mentor,
                    mentee=mentee,
                    day=date.today(),
                    time=time(14, 0),  # 2:00 PM
                    title='Test Session',
                    note='This is a test booking',
                    status='pending'
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Test booking created: {test_booking}')
                )
                
                # Test status methods
                self.stdout.write(f'  - Is pending: {test_booking.is_pending()}')
                self.stdout.write(f'  - Can be modified by mentor: {test_booking.can_be_modified_by(mentor)}')
                self.stdout.write(f'  - Can be modified by mentee: {test_booking.can_be_modified_by(mentee)}')
                
                # Test approval
                success = test_booking.approve(send_email=False)
                self.stdout.write(f'  - Approval success: {success}')
                self.stdout.write(f'  - Status after approval: {test_booking.status}')
                
                # Clean up
                test_booking.delete()
                self.stdout.write('  - Test booking cleaned up')
                
            else:
                self.stdout.write(
                    self.style.WARNING('Cannot create test booking: missing mentor or mentee')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating test booking: {e}')
            )
        
        # Test 4: Check existing bookings
        self.stdout.write('\n4. Checking existing bookings...')
        try:
            total_bookings = Booking.objects.count()
            pending_bookings = Booking.objects.filter(status='pending').count()
            approved_bookings = Booking.objects.filter(status='approved').count()
            denied_bookings = Booking.objects.filter(status='denied').count()
            
            self.stdout.write(f'Total bookings: {total_bookings}')
            self.stdout.write(f'Pending: {pending_bookings}')
            self.stdout.write(f'Approved: {approved_bookings}')
            self.stdout.write(f'Denied: {denied_bookings}')
            
            # Show recent bookings
            recent_bookings = Booking.objects.order_by('-created_at')[:5]
            if recent_bookings:
                self.stdout.write('\nRecent bookings:')
                for booking in recent_bookings:
                    self.stdout.write(f'  - {booking}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error checking bookings: {e}')
            )
        
        # Test 5: Database connection
        self.stdout.write('\n5. Testing database connection...')
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                if result:
                    self.stdout.write(
                        self.style.SUCCESS('✓ Database connection working')
                    )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Database connection error: {e}')
            )
        
        self.stdout.write(
            self.style.SUCCESS('\nBooking system test completed!')
        )
        
        # Recommendations
        self.stdout.write('\n' + '='*50)
        self.stdout.write('RECOMMENDATIONS:')
        self.stdout.write('1. Make sure to run: python manage.py migrate')
        self.stdout.write('2. Create test users with mentor and mentee roles')
        self.stdout.write('3. Check Django server is running on correct port')
        self.stdout.write('4. Verify CORS settings for frontend communication')
        self.stdout.write('='*50)
