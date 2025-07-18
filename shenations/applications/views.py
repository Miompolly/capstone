from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Opportunity, Application
from .serializers import OpportunitySerializer, ApplicationSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Opportunity
from .serializers import OpportunitySerializer

class OpportunityListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        opportunities = Opportunity.objects.filter(is_active=True)
        serializer = OpportunitySerializer(opportunities, many=True)
        return Response(serializer.data)

    def post(self, request):
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        if user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to create opportunities."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({
                "detail": "Opportunity created successfully",
                "opportunity": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OpportunityDetailView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        serializer = OpportunitySerializer(opportunity)
        return Response(serializer.data)

    def put(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        # Allow if user is the owner or has an allowed role
        if opportunity.created_by != request.user and user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to update this opportunity."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OpportunitySerializer(opportunity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "detail": "Opportunity updated successfully",
                "opportunity": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        if opportunity.created_by != request.user and user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to delete this opportunity."},
                status=status.HTTP_403_FORBIDDEN
            )

        opportunity.delete()
        return Response(
            {"detail": "Opportunity deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )



from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, opportunity_pk):
        applications = Application.objects.filter(opportunity_id=opportunity_pk, user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request, opportunity_pk):
        # Check if the user has already applied
        if Application.objects.filter(user=request.user, opportunity_id=opportunity_pk).exists():
            return Response(
                {
                    "success": False,
                    "message": "You have already applied for this opportunity. Check your applications for more details.",
                },
                status=status.HTTP_200_OK  # Don't treat it as a hard error
            )

        data = request.data.copy()
        data["opportunity"] = opportunity_pk

        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "success": True,
                    "message": "Your application has been submitted successfully!",
                    "application": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "There was a problem with your application.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ApplicationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        application = get_object_or_404(Application, pk=pk, user=request.user)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)



class MyOpportunityApplicationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        my_opportunities = Opportunity.objects.filter(created_by=request.user)
        applications = Application.objects.filter(opportunity__in=my_opportunities)
        serializer = ApplicationSerializer(applications, many=True)
        return Response({
            "success": True,
            "message": f"You have received {applications.count()} application(s) for your posted opportunities.",
            "applications": serializer.data
        }, status=status.HTTP_200_OK)