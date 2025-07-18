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
