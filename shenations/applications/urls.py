from django.urls import path
from .views import (
    MyOpportunityApplicationsView,
    OpportunityListCreateView,
    OpportunityDetailView,
    ApplicationListCreateView,
    ApplicationDetailView,
)

urlpatterns = [
    path('opportunities/', OpportunityListCreateView.as_view(), name='opportunity-list-create'),
    path('opportunities/<int:pk>/', OpportunityDetailView.as_view(), name='opportunity-detail'),
    path('opportunities/<int:opportunity_pk>/applications/', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('my-opportunity-applications/', MyOpportunityApplicationsView.as_view(), name='my_opportunity_applications'),
]