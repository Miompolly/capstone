from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User


class UserManagementTestCase(APITestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create(
            name="Admin User",
            email="admin@test.com",
            password=make_password("testpass123"),
            phone="1234567890",
            location="Test City",
            role="admin",
            education_level="bachelor",
            is_active=True
        )

        # Create regular user
        self.regular_user = User.objects.create(
            name="Regular User",
            email="user@test.com",
            password=make_password("testpass123"),
            phone="0987654321",
            location="Test City",
            role="mentee",
            education_level="bachelor",
            is_active=True
        )

        # Create inactive user
        self.inactive_user = User.objects.create(
            name="Inactive User",
            email="inactive@test.com",
            password=make_password("testpass123"),
            phone="1111111111",
            location="Test City",
            role="mentee",
            education_level="bachelor",
            is_active=False
        )

    def get_admin_token(self):
        """Helper method to get admin authentication token"""
        response = self.client.post('/auth/login/', {
            'email': 'admin@test.com',
            'password': 'testpass123'
        })
        return response.data['access']

    def test_admin_can_delete_user(self):
        """Test that admin can delete users"""
        token = self.get_admin_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.delete(f'/auth/user/{self.regular_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify user is deleted
        self.assertFalse(User.objects.filter(id=self.regular_user.id).exists())

    def test_admin_can_update_user_status(self):
        """Test that admin can activate/deactivate users"""
        token = self.get_admin_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Deactivate active user
        response = self.client.put(f'/auth/user/{self.regular_user.id}/', {
            'is_active': False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify user is deactivated
        self.regular_user.refresh_from_db()
        self.assertFalse(self.regular_user.is_active)

        # Activate inactive user
        response = self.client.put(f'/auth/user/{self.inactive_user.id}/', {
            'is_active': True
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify user is activated
        self.inactive_user.refresh_from_db()
        self.assertTrue(self.inactive_user.is_active)

    def test_non_admin_cannot_delete_user(self):
        """Test that non-admin users cannot delete users"""
        # Login as regular user
        response = self.client.post('/auth/login/', {
            'email': 'user@test.com',
            'password': 'testpass123'
        })
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.delete(f'/auth/user/{self.inactive_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_admin_cannot_update_user_status(self):
        """Test that non-admin users cannot update user status"""
        # Login as regular user
        response = self.client.post('/auth/login/', {
            'email': 'user@test.com',
            'password': 'testpass123'
        })
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.put(f'/auth/user/{self.inactive_user.id}/', {
            'is_active': True
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
