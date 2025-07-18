from rest_framework import serializers
from .models import Course, Lesson, Enrollment, LessonProgress, CourseReview


class CourseSerializer(serializers.ModelSerializer):
    posted_by = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_posted_by(self, obj):
        return obj.posted_by.name 

class LessonSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'
        extra_kwargs = {
            'video_url': {'required': False, 'allow_null': True},
            'image_url': {'required': False, 'allow_null': True},
        }

    def get_course_title(self, obj):
        return obj.course.title if obj.course else None


from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework import serializers
from .models import Enrollment, Course  

class EnrollmentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    course_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'progress', 'certificate_earned', 'enrolled_on', 'user', 'course', 'course_title']
        read_only_fields = ['id', 'user', 'enrolled_on', 'certificate_earned', 'course_title']

    def get_user(self, obj):
        if obj.user:
            return getattr(obj.user, 'get_full_name', lambda: obj.user.name)() or obj.user.email
        return None

    def get_course_title(self, obj):
        return obj.course.title if obj.course else None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        else:
            raise serializers.ValidationError("User information is missing from request context.")
        return super().create(validated_data)



class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = LessonProgress
        fields = ['id', 'completed', 'watched_on', 'enrollment', 'lesson', 'lesson_name', 'course_title']
        read_only_fields = ['lesson_name', 'course_title']  # only these are read-only now

    def get_lesson_name(self, obj):
        return obj.lesson.title if obj.lesson else None

    def get_course_title(self, obj):
        return obj.lesson.course.title if obj.lesson and obj.lesson.course else None
    



class CourseReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CourseReview
        fields = ['id', 'course', 'user', 'rating', 'comment', 'created_at']


class CourseReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = ['course', 'rating', 'comment']

    def validate(self, attrs):
        user = self.context['request'].user
        course = attrs.get('course')

        if CourseReview.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError("You have already reviewed this course.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        return CourseReview.objects.create(user=user, **validated_data)


class CourseReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = ['rating', 'comment']
        extra_kwargs = {
            'rating': {'required': False},
            'comment': {'required': False},
        }
