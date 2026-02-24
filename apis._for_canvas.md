# Canvas LMS API Quick Reference

This document is a practical map of the Canvas LMS REST APIs you're most
likely to use in a student-facing application, plus authentication and
implementation notes.

------------------------------------------------------------------------

## Base URL

https://`<canvas-domain>`{=html}/api/v1/

------------------------------------------------------------------------

## Authentication (OAuth2)

Authorization Endpoint: /login/oauth2/auth

Token Endpoint: /login/oauth2/token

Header for API calls: Authorization: Bearer `<ACCESS_TOKEN>`{=html}

------------------------------------------------------------------------

## Core API Families

### Users & Profiles

GET /api/v1/users/self\
GET /api/v1/users/:id/profile

### Courses

GET /api/v1/courses\
GET /api/v1/courses/:course_id

### Enrollments

GET /api/v1/courses/:course_id/enrollments

### Assignments

GET /api/v1/courses/:course_id/assignments\
GET /api/v1/courses/:course_id/assignments/:assignment_id

### Submissions & Grades

GET
/api/v1/courses/:course_id/assignments/:assignment_id/submissions/self\
GET /api/v1/courses/:course_id/enrollments

### Announcements

GET /api/v1/announcements

### Discussions

GET /api/v1/courses/:course_id/discussion_topics

### Calendar Events

GET /api/v1/calendar_events

### Modules

GET /api/v1/courses/:course_id/modules\
GET /api/v1/courses/:course_id/modules/:module_id/items

### Quizzes

GET /api/v1/courses/:course_id/quizzes

### Files

GET /api/v1/courses/:course_id/files\
GET /api/v1/users/self/files

### Groups

GET /api/v1/users/self/groups

### Analytics

GET /api/v1/courses/:course_id/analytics

------------------------------------------------------------------------

## Recommended MVP Bundle

-   Users
-   Courses
-   Assignments
-   Submissions
-   Calendar Events

------------------------------------------------------------------------

## Example Request

curl "https://canvas.example.edu/api/v1/courses"\
-H "Authorization: Bearer `<ACCESS_TOKEN>`{=html}"

------------------------------------------------------------------------

## Notes

-   Always use OAuth2
-   Never collect Canvas passwords
-   Store tokens securely
-   Follow pagination headers

------------------------------------------------------------------------

Official Docs: https://developerdocs.instructure.com/services/canvas
