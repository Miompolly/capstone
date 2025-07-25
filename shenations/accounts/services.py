from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class BookingNotificationService:
    """Service for sending booking-related email notifications"""
    
    @staticmethod
    def send_booking_approved_email(booking):
        """Send email notification when a booking is approved"""
        try:
            subject = f"🎉 Your booking with {booking.mentor.name} has been approved!"
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [booking.mentee.email]
            
            # Context for email template
            context = {
                'mentee_name': booking.mentee.name,
                'mentor_name': booking.mentor.name,
                'booking_date': booking.day.strftime('%B %d, %Y'),
                'booking_time': booking.time.strftime('%I:%M %p') if booking.time else 'Time not specified',
                'session_title': booking.title or 'Mentorship Session',
                'session_note': booking.note,
                'booking_id': booking.id,
                'platform_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:3000'),
                'current_year': timezone.now().year,
                'google_meet_link': booking.google_meet_link,
            }
            
            # HTML email content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Booking Approved - SheNation</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .booking-card {{ background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 8px; }}
                    .button {{ display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }}
                    .success-icon {{ font-size: 48px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="success-icon">✅</div>
                        <h1>Booking Approved!</h1>
                        <p>Great news! Your mentorship session has been confirmed.</p>
                    </div>
                    
                    <div class="content">
                        <p>Hi {context['mentee_name']},</p>
                        
                        <p>Excellent news! <strong>{context['mentor_name']}</strong> has approved your booking request. Your mentorship session is now confirmed!</p>
                        
                        <div class="booking-card">
                            <h3>📅 Session Details</h3>
                            <p><strong>Session:</strong> {context['session_title']}</p>
                            <p><strong>Date:</strong> {context['booking_date']}</p>
                            <p><strong>Time:</strong> {context['booking_time']}</p>
                            <p><strong>Mentor:</strong> {context['mentor_name']}</p>
                            {f"<p><strong>Note:</strong> {context['session_note']}</p>" if context['session_note'] else ""}
                            {f"<p><strong>🎥 Meeting Link:</strong> <a href='{context['google_meet_link']}' style='color: #1a73e8; text-decoration: none;'>Join Google Meet</a></p>" if context.get('google_meet_link') else ""}
                        </div>
                        
                        <p>🎯 <strong>What's Next?</strong></p>
                        <ul>
                            <li>Add this session to your calendar</li>
                            <li>Prepare any questions you'd like to discuss</li>
                            <li>Join the session at the scheduled time</li>
                        </ul>
                        
                        <a href="{context['platform_url']}/bookings" class="button">View My Bookings</a>
                        
                        <p>We're excited for your mentorship journey! If you have any questions, feel free to reach out.</p>
                        
                        <p>Best regards,<br>The SheNation Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>&copy; {context['current_year']} SheNation. All rights reserved.</p>
                        <p>Empowering women through mentorship and growth.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            Booking Approved - SheNation
            
            Hi {context['mentee_name']},
            
            Great news! {context['mentor_name']} has approved your booking request.
            
            Session Details:
            - Session: {context['session_title']}
            - Date: {context['booking_date']}
            - Time: {context['booking_time']}
            - Mentor: {context['mentor_name']}
            {f"- Note: {context['session_note']}" if context['session_note'] else ""}
            
            What's Next:
            - Add this session to your calendar
            - Prepare any questions you'd like to discuss
            - Join the session at the scheduled time
            
            View your bookings: {context['platform_url']}/bookings
            
            Best regards,
            The SheNation Team
            """
            
            # Send email
            email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            logger.info(f"Booking approved email sent to {booking.mentee.email} for booking {booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send booking approved email for booking {booking.id}: {str(e)}")
            return False
    
    @staticmethod
    def send_booking_denied_email(booking):
        """Send email notification when a booking is denied"""
        try:
            subject = f"Update on your booking request with {booking.mentor.name}"
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [booking.mentee.email]
            
            # Context for email template
            context = {
                'mentee_name': booking.mentee.name,
                'mentor_name': booking.mentor.name,
                'booking_date': booking.day.strftime('%B %d, %Y'),
                'booking_time': booking.time.strftime('%I:%M %p') if booking.time else 'Time not specified',
                'session_title': booking.title or 'Mentorship Session',
                'session_note': booking.note,
                'booking_id': booking.id,
                'platform_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:3000'),
                'current_year': timezone.now().year,
            }
            
            # HTML email content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Booking Update - SheNation</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .booking-card {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px; }}
                    .button {{ display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }}
                    .info-icon {{ font-size: 48px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="info-icon">📋</div>
                        <h1>Booking Update</h1>
                        <p>An update on your mentorship session request</p>
                    </div>
                    
                    <div class="content">
                        <p>Hi {context['mentee_name']},</p>
                        
                        <p>Thank you for your interest in booking a session with <strong>{context['mentor_name']}</strong>. Unfortunately, they are unable to accommodate your request for the requested time slot.</p>
                        
                        <div class="booking-card">
                            <h3>📅 Requested Session Details</h3>
                            <p><strong>Session:</strong> {context['session_title']}</p>
                            <p><strong>Date:</strong> {context['booking_date']}</p>
                            <p><strong>Time:</strong> {context['booking_time']}</p>
                            <p><strong>Mentor:</strong> {context['mentor_name']}</p>
                        </div>
                        
                        <p>💡 <strong>What You Can Do Next:</strong></p>
                        <ul>
                            <li>Try booking a different time slot with the same mentor</li>
                            <li>Explore other available mentors in your area of interest</li>
                            <li>Contact the mentor directly if you have questions</li>
                        </ul>
                        
                        <a href="{context['platform_url']}/mentorship" class="button">Find Another Mentor</a>
                        
                        <p>Don't be discouraged! There are many amazing mentors on our platform ready to help you grow. Keep exploring and you'll find the perfect match.</p>
                        
                        <p>Best regards,<br>The SheNation Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>&copy; {context['current_year']} SheNation. All rights reserved.</p>
                        <p>Empowering women through mentorship and growth.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            Booking Update - SheNation
            
            Hi {context['mentee_name']},
            
            Thank you for your interest in booking a session with {context['mentor_name']}. 
            Unfortunately, they are unable to accommodate your request for the requested time slot.
            
            Requested Session Details:
            - Session: {context['session_title']}
            - Date: {context['booking_date']}
            - Time: {context['booking_time']}
            - Mentor: {context['mentor_name']}
            
            What You Can Do Next:
            - Try booking a different time slot with the same mentor
            - Explore other available mentors in your area of interest
            - Contact the mentor directly if you have questions
            
            Find another mentor: {context['platform_url']}/mentorship
            
            Don't be discouraged! Keep exploring and you'll find the perfect match.
            
            Best regards,
            The SheNation Team
            """
            
            # Send email
            email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            logger.info(f"Booking denied email sent to {booking.mentee.email} for booking {booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send booking denied email for booking {booking.id}: {str(e)}")
            return False
    
    @staticmethod
    def send_new_booking_request_email(booking):
        """Send email notification to mentor when they receive a new booking request"""
        try:
            subject = f"New booking request from {booking.mentee.name}"
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [booking.mentor.email]
            
            context = {
                'mentor_name': booking.mentor.name,
                'mentee_name': booking.mentee.name,
                'booking_date': booking.day.strftime('%B %d, %Y'),
                'booking_time': booking.time.strftime('%I:%M %p') if booking.time else 'Time not specified',
                'session_title': booking.title or 'Mentorship Session',
                'session_note': booking.note,
                'booking_id': booking.id,
                'platform_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:3000'),
                'current_year': timezone.now().year,
            }
            
            # HTML email content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>New Booking Request - SheNation</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .booking-card {{ background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 8px; }}
                    .button {{ display: inline-block; background-color: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }}
                    .approve-btn {{ background-color: #28a745; }}
                    .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }}
                    .notification-icon {{ font-size: 48px; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="notification-icon">🔔</div>
                        <h1>New Booking Request</h1>
                        <p>You have a new mentorship session request</p>
                    </div>
                    
                    <div class="content">
                        <p>Hi {context['mentor_name']},</p>
                        
                        <p>You have received a new booking request from <strong>{context['mentee_name']}</strong>. Please review the details below and decide whether to approve or deny this request.</p>
                        
                        <div class="booking-card">
                            <h3>📅 Session Request Details</h3>
                            <p><strong>Session:</strong> {context['session_title']}</p>
                            <p><strong>Date:</strong> {context['booking_date']}</p>
                            <p><strong>Time:</strong> {context['booking_time']}</p>
                            <p><strong>Requested by:</strong> {context['mentee_name']}</p>
                            {f"<p><strong>Note:</strong> {context['session_note']}</p>" if context['session_note'] else ""}
                        </div>
                        
                        <p>⏰ <strong>Action Required:</strong> Please respond to this booking request as soon as possible.</p>
                        
                        <div style="text-align: center;">
                            <a href="{context['platform_url']}/mentor-bookings" class="button approve-btn">Review Request</a>
                        </div>
                        
                        <p>You can approve or deny this request from your booking management dashboard. The mentee will be notified of your decision automatically.</p>
                        
                        <p>Best regards,<br>The SheNation Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>&copy; {context['current_year']} SheNation. All rights reserved.</p>
                        <p>Empowering women through mentorship and growth.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            New Booking Request - SheNation
            
            Hi {context['mentor_name']},
            
            You have received a new booking request from {context['mentee_name']}.
            
            Session Request Details:
            - Session: {context['session_title']}
            - Date: {context['booking_date']}
            - Time: {context['booking_time']}
            - Requested by: {context['mentee_name']}
            {f"- Note: {context['session_note']}" if context['session_note'] else ""}
            
            Please review and respond to this request: {context['platform_url']}/mentor-bookings
            
            Best regards,
            The SheNation Team
            """
            
            # Send email
            email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            logger.info(f"New booking request email sent to {booking.mentor.email} for booking {booking.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send new booking request email for booking {booking.id}: {str(e)}")
            return False
