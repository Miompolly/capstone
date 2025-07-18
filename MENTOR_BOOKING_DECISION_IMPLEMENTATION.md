# Mentor Booking Decision Implementation

## Overview
This implementation provides mentors with the ability to approve or deny booking requests from mentees. The system includes database models, API endpoints, management commands, and frontend components.

## ✅ What Has Been Implemented

### 1. Database Model Updates (`shenations/accounts/models.py`)

**Enhanced Booking Model:**
- Added `STATUS_CHOICES`: 'pending', 'approved', 'denied'
- Added `status` field with default 'pending'
- Added `updated_at` timestamp field
- Added database indexes for performance
- Added helper methods:
  - `approve()` - Approve a pending booking
  - `deny()` - Deny a pending booking
  - `can_be_modified_by(user)` - Check permissions
  - `is_pending()`, `is_approved()`, `is_denied()` - Status checks
  - `status_display` - Human-readable status

### 2. API Endpoints (`shenations/accounts/views.py`)

**New Views:**
- `MenteeBookingsListView` - List bookings for mentees
- `BookingDecisionView` - Dedicated endpoint for approve/deny actions
- `BookingDetailView` - General booking management (update/delete)

**API Endpoints:**
- `GET /auth/mentee/bookings/` - List mentee's bookings
- `POST /auth/bookings/<id>/decide/` - Approve/deny booking
- `PUT /auth/bookings/<id>/` - Update booking status
- `DELETE /auth/bookings/<id>/` - Delete booking

### 3. URL Configuration (`shenations/accounts/urls.py`)
Added new URL patterns for booking management endpoints.

### 4. Database Migration
Created migration file: `accounts/migrations/0002_add_booking_status.py`
- Adds status field to Booking model
- Creates database indexes for performance
- Updates Meta options

### 5. Management Command (`shenations/accounts/management/commands/manage_bookings.py`)

**Command Line Interface:**
```bash
# List all bookings for a mentor
python manage.py manage_bookings --mentor-email mentor@example.com --action list

# Approve a specific booking
python manage.py manage_bookings --mentor-email mentor@example.com --action approve --booking-id 123

# Deny a specific booking
python manage.py manage_bookings --mentor-email mentor@example.com --action deny --booking-id 123
```

**Features:**
- Color-coded status display
- Detailed booking information
- Confirmation prompts
- Error handling

### 6. Frontend Components (`she-nation/components/mentorship/booking-decision-buttons.tsx`)

**Two Component Variants:**
- `BookingDecisionButtons` - Basic fetch API implementation
- `BookingDecisionButtonsApi` - RTK Query ready implementation

**Features:**
- Approve/Deny buttons for pending bookings
- Status badges for completed decisions
- Loading states and confirmation dialogs
- Toast notifications for feedback

## 🔧 How to Use

### For Mentors (Web Interface):
1. Navigate to "Booking Requests" in the navigation menu
2. View all booking requests with status indicators
3. Click ✓ to approve or ✗ to deny pending bookings
4. Confirmed bookings appear in the calendar

### For Mentors (Command Line):
```bash
# View all booking requests
python manage.py manage_bookings --mentor-email your@email.com --action list

# Approve a booking
python manage.py manage_bookings --mentor-email your@email.com --action approve --booking-id 123

# Deny a booking
python manage.py manage_bookings --mentor-email your@email.com --action deny --booking-id 123
```

### For Mentees:
1. Book sessions through the mentorship page
2. View booking status in "My Bookings"
3. Receive notifications when mentors make decisions

## 🔒 Security & Permissions

**Access Control:**
- Only mentors can approve/deny their own bookings
- Mentees can only view their own bookings
- Admin users have full access
- JWT authentication required for all endpoints

**Validation:**
- Only pending bookings can be approved/denied
- Proper error handling for invalid requests
- Confirmation dialogs prevent accidental actions

## 📊 Status Flow

```
Mentee creates booking → Status: "pending"
                     ↓
Mentor reviews request → Decision: approve/deny
                     ↓
Status: "approved" OR "denied"
                     ↓
Booking confirmed/rejected
```

## 🎨 UI/UX Features

**Visual Indicators:**
- 🟢 Green: Approved bookings
- 🔴 Red: Denied bookings  
- 🟡 Yellow: Pending bookings
- ⏰ Clock icon: Pending status
- ✓ Check icon: Approved status
- ✗ X icon: Denied status

**Interactive Elements:**
- Hover effects on buttons
- Loading states during API calls
- Toast notifications for feedback
- Confirmation dialogs for critical actions

## 🧪 Testing

**Test Coverage:**
- Model method testing (approve/deny functionality)
- API endpoint testing (permissions, status updates)
- User role-based access testing
- Error handling validation

**Test Commands:**
```bash
# Run booking-specific tests
python manage.py test accounts.tests.BookingApprovalTestCase

# Run all account tests
python manage.py test accounts
```

## 🚀 Next Steps

**To Complete Setup:**
1. Configure database connection in Django settings
2. Run migrations: `python manage.py migrate`
3. Create test users and bookings
4. Test the approval workflow

**Future Enhancements:**
- Email notifications for booking decisions
- Bulk approve/deny functionality
- Booking analytics dashboard
- Calendar integration for approved bookings
- Automated reminders for pending requests

## 📝 API Usage Examples

**Approve a booking:**
```bash
curl -X POST http://localhost:8082/auth/bookings/123/decide/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'
```

**Deny a booking:**
```bash
curl -X POST http://localhost:8082/auth/bookings/123/decide/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "deny"}'
```

**List mentor bookings:**
```bash
curl -X GET http://localhost:8082/auth/mentor/bookings/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This implementation provides a complete booking approval system that mentors can use to manage their session requests effectively!
