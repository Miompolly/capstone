from .models import Booking
from django.contrib import admin

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('mentor', 'mentee', 'day', 'time', 'title', 'note')
    list_filter = ('day', 'mentor')
    search_fields = ('mentor__username', 'mentee__username', 'title', 'note')
