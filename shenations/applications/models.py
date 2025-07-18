from django.conf import settings
from django.db import models

class Opportunity(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    description = models.TextField()
    eligibility_criteria = models.TextField()
    location = models.CharField(max_length=255)
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='opportunities'
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-deadline', 'title']

class Application(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    opportunity = models.ForeignKey('Opportunity', on_delete=models.CASCADE)
    
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    resume_url = models.URLField(blank=True, null=True)

    status = models.CharField(max_length=100, default='pending')
    date_applied = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} applied for {self.opportunity.title}"

    class Meta:
        unique_together = ('user', 'opportunity')
        ordering = ['-date_applied']



