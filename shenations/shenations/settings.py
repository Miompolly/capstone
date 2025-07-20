import os
from datetime import timedelta
from decouple import config # Make sure decouple is imported if you're using it for SIGNING_KEY


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = '6+_uqb@a-io2-iqyuy--bwcs$boaj#l0tf1o_5%zjqi5u$02!)' # Consider moving this to .env
DEBUG = True # Set to False in production

# Update ALLOWED_HOSTS to include your Render domain
ALLOWED_HOSTS = ['capstone-o3oh.onrender.com', 'localhost', '127.0.0.1'] 


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'accounts',
    'courses',
    'corsheaders',
    'applications',
    # Removed 'capstone-o3oh.onrender.com', 'localhost', '127.0.0.1' from INSTALLED_APPS
    # as they don't belong here. They belong in ALLOWED_HOSTS.
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'shenations.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [], # This can be empty if you're using 'APP_DIRS': True
        'APP_DIRS': True, # This tells Django to look for templates in 'templates' subdirectories of your apps
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages', # <--- THIS LINE IS CRUCIAL
            ],
        },
    },
]

WSGI_APPLICATION = 'shenations.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT', '5432'),
    }
}

SIGNING_KEY = config('SIGNING_KEY') # Ensure this is correctly fetched
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=365),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=365),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SIGNING_KEY,
}
# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True
AUTH_USER_MODEL = 'accounts.User' 

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

CORS_ALLOW_ALL_ORIGINS = True # Consider sexplicitly listing allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8082", 
    "http://92.113.31.238",
    "https://capstone-o3oh.onrender.com", 
]
ALLOWED_HOSTS = ['*']


EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_HOST_USER="57joel39@gmail.com"
EMAIL_HOST_PASSWORD="sxkzlknzpukgwwka"
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER 
