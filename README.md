# Job Portal - API

This is an API for a Job Portal project, designed with Node.js and Express.js. The API allows users to sign up, sign in, create job posts, view available jobs, and delete job posts. JWT authentication is used to secure specific routes.

## Features
- User authentication (Sign Up & Sign In)
- JWT token-based authentication
- Create, read, and delete job posts
- RESTful API design

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT for authentication
  
## API Endpoints

#### **Authentication**
* **`/signup`** (POST)
  * Body:
    ```json
    {
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```


* **`/signin`** (POST)
  * Body:
    ```json
    {
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```

#### **Job Management**
* **`/jobs`** (GET)
  * Authorization: Bearer token
    
* **`/jobs`** (POST)
  * Authorization: Bearer token
  * Body:
    ```json
    {
      "title": "Job Title",
      "description": "Job Description",
      "location": "Job Location",
      "salary": "Job Salary",
      "id" : "34795324974"
    }
    ```
  
* **`/jobs/:id`** (DELETE)
  
