from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Course, Lesson, Enrollment, LessonProgress, CourseReview
from .serializers import (
    CourseSerializer, LessonSerializer, EnrollmentSerializer, 
    LessonProgressSerializer, CourseReviewSerializer, 
    CourseReviewCreateSerializer, CourseReviewUpdateSerializer
)

class CourseListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can create courses."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)
            return Response({"detail": "Course created successfully", "course": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        if course.posted_by != request.user:
            return Response({"detail": "You can only update your own courses."}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can update courses."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Course updated successfully", "course": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        if course.posted_by != request.user:
            return Response({"detail": "You can only delete your own courses."}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can delete courses."}, status=status.HTTP_403_FORBIDDEN)

        course.delete()
        return Response({"detail": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Similar structure for Lessons

class LessonListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can create lessons."}, status=status.HTTP_403_FORBIDDEN)

        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Lesson created successfully", "lesson": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LessonDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

        # Optionally check if user can update lesson (based on course posted_by or role)
        course = lesson.course
        if course.posted_by != request.user:
            return Response({"detail": "You can only update lessons in your own courses."}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can update lessons."}, status=status.HTTP_403_FORBIDDEN)

        serializer = LessonSerializer(lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Lesson updated successfully", "lesson": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

        course = lesson.course
        if course.posted_by != request.user:
            return Response({"detail": "You can only delete lessons in your own courses."}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can delete lessons."}, status=status.HTTP_403_FORBIDDEN)

        lesson.delete()
        return Response({"detail": "Lesson deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Enrollment Views (Learners can enroll)

class EnrollmentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EnrollmentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Enrolled successfully", "enrollment": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        enrollment = get_object_or_404(Enrollment, pk=pk)
        if enrollment.user != request.user:
            return Response({"detail": "You can only view your own enrollments."}, status=status.HTTP_403_FORBIDDEN)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            enrollment = Enrollment.objects.get(pk=pk)
        except Enrollment.DoesNotExist:
            return Response({"detail": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND)

        if enrollment.user != request.user:
            return Response({"detail": "You can only update your own enrollments."}, status=status.HTTP_403_FORBIDDEN)

        serializer = EnrollmentSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Enrollment updated successfully", "enrollment": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            enrollment = Enrollment.objects.get(pk=pk)
        except Enrollment.DoesNotExist:
            return Response({"detail": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND)

        if enrollment.user != request.user:
            return Response({"detail": "You can only delete your own enrollments."}, status=status.HTTP_403_FORBIDDEN)

        enrollment.delete()
        return Response({"detail": "Enrollment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# LessonProgress Views

class LessonProgressListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        lesson_progresses = LessonProgress.objects.filter(enrollment__user=request.user)
        serializer = LessonProgressSerializer(lesson_progresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        enrollment_id = request.data.get('enrollment')
        lesson_id = request.data.get('lesson')
        try:
            progress = LessonProgress.objects.get(enrollment_id=enrollment_id, lesson_id=lesson_id)
            serializer = LessonProgressSerializer(progress, data=request.data, partial=True)
        except LessonProgress.DoesNotExist:
            serializer = LessonProgressSerializer(data=request.data)

        if serializer.is_valid():
            if serializer.validated_data['enrollment'].user != request.user:
                return Response({"detail": "You can only update progress for your own enrollments."}, status=status.HTTP_403_FORBIDDEN)

            serializer.save()
            return Response({"detail": "Lesson progress recorded", "lesson_progress": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# CourseReview Views
class CourseReviewListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_pk):
        reviews = CourseReview.objects.filter(course_id=course_pk)
        serializer = CourseReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, course_pk):
        data = request.data.copy()
        data['course'] = course_pk
        serializer = CourseReviewCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Review created successfully", "review": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseReviewDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        review = get_object_or_404(CourseReview, pk=pk)
        serializer = CourseReviewSerializer(review)
        return Response(serializer.data)

    def put(self, request, pk):
        review = get_object_or_404(CourseReview, pk=pk)

        if review.user != request.user:
            return Response({"detail": "You can only update your own reviews."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CourseReviewUpdateSerializer(review, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Review updated successfully", "review": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = get_object_or_404(CourseReview, pk=pk)

        if review.user != request.user:
            return Response({"detail": "You can only delete your own reviews."}, status=status.HTTP_403_FORBIDDEN)

        review.delete()
        return Response({"detail": "Review deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from .models import Lesson  # your Lesson model
from .serializers import LessonSerializer  # serializer for Lesson model

class LessonListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        Lessons = Lesson.objects.all()
        serializer = LessonSerializer(Lessons, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can create Lessons."}, status=status.HTTP_403_FORBIDDEN)

        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Lesson created successfully", "Lesson": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        Lesson = get_object_or_404(Lesson, pk=pk)
        serializer = LessonSerializer(Lesson)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            Lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

        # Optional: Add permission logic similar to Lesson, e.g. only owner or roles Mentor/Expert can update
        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can update Lessons."}, status=status.HTTP_403_FORBIDDEN)

        serializer = LessonSerializer(Lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Lesson updated successfully", "Lesson": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            Lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['Mentor', 'Expert']:
            return Response({"detail": "Only Mentors and experts can delete Lessons."}, status=status.HTTP_403_FORBIDDEN)

        Lesson.delete()
        return Response({"detail": "Lesson deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class CourseEnrollmentView(APIView):
    """
    Handle course enrollment
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        """Enroll in a course"""
        try:
            course = get_object_or_404(Course, id=course_id)

            # Check if already enrolled
            existing_enrollment = Enrollment.objects.filter(
                user=request.user,
                course=course
            ).first()

            if existing_enrollment:
                return Response({
                    'detail': f'Already enrolled with status: {existing_enrollment.status}'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create enrollment
            enrollment = Enrollment.objects.create(
                user=request.user,
                course=course,
                status='pending'  # Requires approval
            )

            serializer = EnrollmentSerializer(enrollment)
            return Response({
                'detail': 'Enrollment request submitted successfully',
                'enrollment': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'detail': f'Error enrolling in course: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class MyEnrollmentsView(APIView):
    """
    Get user's enrollments
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get all enrollments for the authenticated user"""
        enrollments = Enrollment.objects.filter(user=request.user).select_related('course', 'course__instructor')

        enrollments_data = []
        for enrollment in enrollments:
            course_data = {
                'id': enrollment.course.id,
                'title': enrollment.course.title,
                'description': enrollment.course.description,
                'instructor': {
                    'id': enrollment.course.instructor.id,
                    'name': enrollment.course.instructor.name,
                    'email': enrollment.course.instructor.email,
                } if enrollment.course.instructor else None,
                'image': enrollment.course.image.url if hasattr(enrollment.course, 'image') and enrollment.course.image else None,
                'price': getattr(enrollment.course, 'price', 0),
                'duration': getattr(enrollment.course, 'duration', ''),
                'level': getattr(enrollment.course, 'level', ''),
                'certificate_available': getattr(enrollment.course, 'certificate_available', False),
            }

            enrollments_data.append({
                'id': enrollment.id,
                'course': course_data,
                'status': enrollment.status,
                'enrolled_on': enrollment.enrolled_on.strftime('%Y-%m-%d'),
                'progress': enrollment.progress,
            })

        return Response(enrollments_data, status=status.HTTP_200_OK)


class EnrollmentProgressView(APIView):
    """
    Update enrollment progress
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, enrollment_id):
        """Update progress for an enrollment"""
        try:
            enrollment = get_object_or_404(
                Enrollment,
                id=enrollment_id,
                user=request.user,
                status='approved'  # Only approved enrollments can have progress updated
            )

            progress = request.data.get('progress', 0)
            if not isinstance(progress, int) or progress < 0 or progress > 100:
                return Response({
                    'detail': 'Progress must be an integer between 0 and 100'
                }, status=status.HTTP_400_BAD_REQUEST)

            enrollment.progress = progress
            if progress == 100:
                enrollment.certificate_earned = True
            enrollment.save()

            return Response({
                'id': enrollment.id,
                'progress': enrollment.progress,
                'certificate_earned': enrollment.certificate_earned
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'detail': f'Error updating progress: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class CourseEnrollmentsView(APIView):
    """
    For course owners to view and manage enrollments
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_id):
        """Get all enrollments for a course (course owner only)"""
        try:
            course = get_object_or_404(Course, id=course_id)

            # Check if user is the course instructor
            if course.instructor != request.user:
                return Response({
                    'detail': 'Only the course instructor can view enrollments'
                }, status=status.HTTP_403_FORBIDDEN)

            enrollments = Enrollment.objects.filter(course=course).select_related('user')

            enrollments_data = []
            for enrollment in enrollments:
                enrollments_data.append({
                    'id': enrollment.id,
                    'user': {
                        'id': enrollment.user.id,
                        'name': enrollment.user.name,
                        'email': enrollment.user.email,
                    },
                    'status': enrollment.status,
                    'enrolled_on': enrollment.enrolled_on.strftime('%Y-%m-%d'),
                    'progress': enrollment.progress,
                })

            return Response(enrollments_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'detail': f'Error fetching enrollments: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentStatusView(APIView):
    """
    For course owners to approve/deny enrollments
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, enrollment_id):
        """Update enrollment status (approve/deny)"""
        try:
            enrollment = get_object_or_404(Enrollment, id=enrollment_id)

            # Check if user is the course instructor
            if enrollment.course.instructor != request.user:
                return Response({
                    'detail': 'Only the course instructor can update enrollment status'
                }, status=status.HTTP_403_FORBIDDEN)

            new_status = request.data.get('status')
            if new_status not in ['approved', 'denied']:
                return Response({
                    'detail': 'Status must be either "approved" or "denied"'
                }, status=status.HTTP_400_BAD_REQUEST)

            enrollment.status = new_status
            enrollment.save()

            return Response({
                'id': enrollment.id,
                'status': enrollment.status,
                'user': enrollment.user.name,
                'course': enrollment.course.title
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'detail': f'Error updating enrollment status: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
