from django.urls import path
from .views import (
    CourseListCreateView, CourseDetailView,
    LessonListCreateView, LessonDetailView,
    EnrollmentListCreateView, EnrollmentDetailView,
    LessonProgressListCreateView,
    CourseReviewListCreateView, CourseReviewDetailView
)

urlpatterns = [
    # Courses
    path('', CourseListCreateView.as_view(), name='course-list-create'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Lessons
    path('lessons/', LessonListCreateView.as_view(), name='lesson-list-create'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('sessions/', LessonListCreateView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/', LessonDetailView.as_view(), name='session-detail'),

    # Enrollments
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollment-list-create'),
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),

    # Lesson Progress
    path('lesson-progress/', LessonProgressListCreateView.as_view(), name='lesson-progress-list-create'),

    # Course Reviews - nested under course (course_pk) for listing and creating
    path('<int:course_pk>/reviews/', CourseReviewListCreateView.as_view(), name='course-review-list-create'),
    path('reviews/<int:pk>/', CourseReviewDetailView.as_view(), name='course-review-detail'),
]
