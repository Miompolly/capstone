# SheNation – Digital Empowerment Platform for Burundian Women

The SheNation platform was developed with the mission of transitioning traditional, offline women empowerment programs into a digital format. This web-based solution is specifically tailored for Burundian women aged **18 to 30**, providing them with a centralized online space to access mentorship, enroll in skills-based courses, and explore economic opportunities without the limitations of geography. The primary objective was to make empowerment accessible from anywhere at any time, through any internet-connected device.



## Core Functionalities

The platform recognizes four distinct user roles, each with tailored capabilities that together create a cohesive ecosystem for online empowerment:

* **Administrators:** Oversee the entire system. From the Django admin interface, they can manage and moderate user accounts, approve or deactivate mentors and experts, and publish or archive courses and opportunities. Their role ensures quality control, data integrity, and the smooth day-to-day operation of SheNation.
* **Mentors:** Practitioners who are willing to share their knowledge through structured courses and one-on-one guidance. When mentors sign in, they can create new courses, organize each course into multiple lessons, upload learning materials, schedule live or asynchronous sessions with mentees, and update their public profiles so that prospective learners understand their expertise and availability.
* **Experts:** Experts hold elevated roles similar to administrators. Unlike mentors, experts are permanent contributors to SheNation. They upload recorded in-person mentorship sessions, manage and moderate specialized content, and offer continued support across the platform.
* **Mentees:** Are the core beneficiaries of the platform. After creating an account, they are able to browse and enroll in courses, progress through lesson content, schedule sessions with mentors or experts, apply for live opportunities such as internships or grants, and track their achievements on a personalized dashboard. Validation checks throughout the platform ensure that enrollments, profile edits, and opportunity applications capture complete and accurate information before being processed.

With these four roles working in concert, SheNation offers a holistic environment that supports guided learning, specialized advice, and administrative stewardship.




## Technical Overview

The SheNation platform is developed using modern web technologies to ensure responsiveness, scalability, and maintainability:

* **Frontend:** Powered by **Next.js 15** and written in **TypeScript**, which allows for better component reusability and robust type-checking.
* **Backend:** Uses **Django 5** coupled with **Django Rest Framework** to build a secure and scalable API.
* **Database:** **PostgreSQL** serves as the primary database to handle data persistence.
* **Caching & Asynchronous Tasks:** **Redis** is integrated for caching and asynchronous task handling where needed.
* **Containerization:** The entire application is containerized using **Docker** and managed via **Docker Compose**, enabling easy deployment and consistent development environments.
* **CI/CD:** Facilitated using **GitHub Actions** for the backend, which automatically builds and deploys the latest versions to Docker Hub upon every commit. The frontend's CI/CD is managed by **Vercel**.



## Installation and Running Instructions (Local)

To run the SheNation platform locally, follow these steps to set up the development environment and start the application. These steps assume you have Docker, Docker Compose, and Git installed on your system:

1.  **Clone the repository:**
    Open your terminal and run:

    ```bash
    git clone https://github.com/FoibeU/capstone.git
    cd shenations
    ```

2.  **Configure environment variables:**
    Copy the sample environment configuration file and modify it as needed:

    ```bash
    cp .env.example .env
    ```

3.  **Build the Docker containers:**
    This step compiles both the frontend and backend services into containers:

    ```bash
    docker-compose build
    ```

4.  **Start the application:**
    Launch all services in the background:

    ```bash
    docker compose up -d
    ```

5.  **Run database migrations:**
    Inside the running backend container, apply Django migrations:

    ```bash
    docker compose exec backend python manage.py migrate
    ```

6.  **Create an admin user:**
    To access the Django admin panel:

    ```bash
    docker compose exec backend python manage.py createsuperuser
    ```

7.  **Access the platform:**
    * **Frontend:** `http://localhost:3000`
    * **Backend Admin:** `http://localhost:8082/admin`



## Deployment & Demo

Live deployment of the SheNation platform is available at:

* **Backend:** https://capstone-o3oh.onrender.com     (deployed on render)
* **Frontend:** https://capstone-kohl-chi.vercel.app    (deployed on vercel)

This hosted version allows users and stakeholders to interact with the platform in a real-time setting and test all core functionalities.

### Demo Video link

https://youtu.be/5LxqeZTtoak 



## Testing Strategy and Results

The SheNation platform has been subjected to a rigorous testing process involving multiple strategies to ensure that the system functions as intended, can handle various input scenarios, and performs efficiently across different hardware and software environments.

### Demonstration of the Functionality of the Product

Unit tests and integration tests were run to confirm that the logic behind the backend models, database interactions, and individual React components functioned properly. These were complemented by end-to-end tests that simulated the full user journey, covering actions such as course creation, enrollment, lesson access, and scheduling mentorship sessions.

Validation testing was also carried out to ensure that the platform correctly handled form inputs and user submissions. For instance, fields that require specific formats, such as email addresses or mandatory inputs, such as password and name fields, were checked for enforcement of required constraints. Invalid inputs triggered clear error messages, confirming the presence of well-implemented validation rules.

### Demonstration of the Functionality of the Product with Different Data Values

The system was tested using a variety of data values to observe how it handles both valid and invalid inputs. These tests confirmed that appropriate validations were triggered and handled correctly.

### Performance of the Product Running on Different Specifications of Hardware or Software

The platform was accessed using different devices and browsers to test responsiveness and consistency. It performed reliably on mobile, tablet, and desktop screen sizes, and across major browsers including Chrome, Firefox, and Safari.

* **Screenshot: Mobile View (Phone)**
<img width="234" alt="mobile 2" src="https://github.com/user-attachments/assets/047c8b6e-6fbd-413b-a388-d92a0e2ed862" />

* **Screenshot: Tablet View**

<img width="384" alt="ipad2" src="https://github.com/user-attachments/assets/5dc6b88e-81c5-4e9f-b6ff-9668a37214fd" />

  

* **Screenshot: MacBook Air**

<img width="597" alt="macbook Air" src="https://github.com/user-attachments/assets/7270a6c0-f7cb-44d6-b201-3ea21e83ae03" />

* **Screenshot: Browser**

<img width="958" alt="browser" src="https://github.com/user-attachments/assets/15ece12a-5470-44c6-a3c0-29ad04ec5c90" />

The above testing showed that the 
Shenation platform remains usable for users with different levels of hardware capability.



## Analysis

Based on the test findings, the platform met nearly all the core objectives as set out in the original project proposal. The core features such as mentor-driven course creation, lesson management, mentee enrollment and progress tracking, session scheduling, and opportunity applications were all fully implemented and functioned as intended during testing. The application also demonstrated acceptable load and interaction times, maintaining under 1.3 seconds time-to-interactive on broadband networks and under 3 seconds on 3G connections. These figures fall well within modern usability benchmarks.

However, there was one notable shortcoming in achieving the full extent of the project goals. The system currently lacks an implemented mechanism for onboarding volunteer mentors, which was a part of the envisioned ecosystem for long-term sustainability. This feature remains dependent on establishing collaborations with NGOs and organizations already working with women's empowerment initiatives.

In summary, while the system delivered on most of the functional and technical objectives, the full impact potential can only be achieved when it is complemented with active partnerships that bring volunteer mentors into the platform to provide the updated and rich content to our users.



## Discussion

Throughout the project, I held multiple meetings with my supervisor to align the development process with the initial objectives and expectations. Early in the project, we agreed on the core development tools—Django, Next.js, PostgreSQL, and Docker—as well as the overall vision for the platform. The user interface design was reviewed and approved during this phase, confirming the platform's visual direction.

One significant milestone was refining the target demographic. Based on my supervisor’s guidance, I updated the scope to specifically focus on Burundian women aged 18 to 30, ensuring that the platform’s content, mentorship features, and opportunities directly address the needs of this group. This shift improved the platform’s relevance, usability, and impact.

Another critical discussion centered on content and resource alignment. My supervisor emphasized the importance of providing empowering resources tailored to this demographic. As a result, the platform includes features that support career development, mentorship, and skills-based learning—all optimized for young women in Burundi.

While the technical components were successfully implemented and function as intended, including user registration, course and lesson management, session scheduling, and opportunity tracking, a remaining challenge is onboarding volunteer mentors. Despite the system being ready to support mentor-driven content, the process of recruiting and hosting these contributors is still ongoing. This gap highlights the need for external partnerships with NGOs or empowerment organizations to sustain the platform. mentorship offerings.




## Recommendations & Future Work


As I continue working on this project and conducting further research, I expect to uncover additional insights that could enhance SheNation’s services. These findings may lead to the introduction of new platform features, refined mentorship strategies, or improved methods for engaging users more effectively.

I also  plan to actively encourage NGOs and women's empowerment organizations to embrace digital strategies like SheNation. By supporting and promoting mobile-first, accessible platforms, these organizations can significantly expand their reach to young women across all regions of Burundi, especially those who may not have access to traditional in-person support. I strongly believe that combining SheNation’s innovative digital approach with existing offline initiatives will accelerate impact and make empowerment programs more inclusive and scalable.



