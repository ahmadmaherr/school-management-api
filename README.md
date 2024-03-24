## This project is built with

- Node.js
- MongoDB
- MOngoose 
- Express
- Redis
- JWT

## Get Started

This project require some prequesites and dependencies to be installed, you can find the instructions below:

> To get a local copy, follow these next steps:

## Install

1. Clone the repo with the command:

   git clone https://github.com/ahmadmaherr/school-management-api
   

2. Install dependencies:

   npm install


3. Create databases:

   - Make sure MongoDB & Redis are installed on your machine and is running on port 27017 & 6379 respectively and then run the following command on your command line befire running the project:

    mongod


5. Enviromental Variables Set up:

   - Here are the environmental variables that needs to be set in a .env file. This is the default setting that I used for development, but you can change it to what works for you:


      MONGO_URI=mongodb://localhost:27017/shcoolDB 
      
      SERVICE_NAME=shcoolDB

      JWT_SECRET=thisismysecret
      
      BCRYPT_SALT=8 

      CORTEX_PREFIX=myapp_cortex
      
      CORTEX_REDIS=redis://localhost:6379
      
      CORTEX_TYPE=local

      CACHE_PREFIX=myapp_cache
      
      CACHE_REDIS=redis://localhost:6379

    


8. Run server using the following command:
      
    npm run start

   

## Database Management with Mongoose

I used Mongoose as my Object-Relational Mapping (ORM) tool for interacting with our MongoDB database.

#### Ports

- Server runs on port `3000`
- Database on port `27017`
- Redis on port `6379`

### Database Schemas

#### School Schema

| Field        | Type   | Description                           |
|--------------|--------|---------------------------------------|
| name         | String | Name of the school                    |
| createdAt    | Date   | Date when the school was created      |
| updatedAt    | Date   | Date when the school was last updated |

#### Class Schema

| Field        | Type           | Description                            |
|--------------|----------------|----------------------------------------|
| name         | String         | Name of the class                      |
| _schoolId    | ObjectId       | Reference to the school                |
| createdAt    | Date           | Date when the class was created        |
| updatedAt    | Date           | Date when the class was last updated   |

#### Student Schema

| Field        | Type           | Description                                    |
|--------------|----------------|------------------------------------------------|
| firstName    | String         | Student's first name.                          |
| lastName     | String         | Student's last name.                           |
| birthdate    | Date           | Student's birthdate.                           |
| _classId     | ObjectId       | Reference to the class the student is in.      |
| createdAt    | Date           | Date when the student record was created.      |
| updatedAt    | Date           | Date when the student record was last updated. |

### User Schema

| Field      | Type           | Description                                                                       |
|------------|----------------|-----------------------------------------------------------------------------------|
| firstName  | String         | User's first name.                                                                |
| lastName   | String         | User's last name.                                                                 |
| username   | String         | The username of the user, must be unique.                                         |
| password   | String         | The password of the user, encrypted using bcrypt.                                 |
| role       | String         | The role of the user, can be either 'superadmin' or 'admin', default is 'admin'.  |
| _schoolId  | ObjectId       | The ID of the school the user belongs to, referenced to the 'School' model.       |
| createdAt  | Date           | Date when the user record was created.                                            |
| updatedAt  | Date           | Date when the user record was last updated.                                       | 


### Relationships between Models
 - School and Class Relationship
  A School can have many Classes. This is represented by the _schoolId foreign key in the Class model, referencing the School model.
  A Class belongs to one School. This is represented by the _schoolId foreign key in the Class model, referencing the School model.
 - Class and Student Relationship
  A Class can have many Students. This is represented by the _classId foreign key in the Student model, referencing the Class model.
  A Student belongs to one Class. This is represented by the _classId foreign key in the Student model, referencing the Class model.
 - User and School Relationship
  A User can belong to one School. This is represented by the _schoolId foreign key in the User model, referencing the School model.
  A School can have many Users (such as administrators or staff members). This is represented by the _schoolId foreign key in the User model, referencing the School model.


### Class Endpoints:

#### 1. Get All Classes
- **Endpoint:** `GET /api/class`
- **Description:** Retrieve a list of all classes.
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "classes": [
      {
        "id": 1,
        "name": "Mathematics",
        "_schoolId": "school_id_1",
        "createdAt": "2023-01-01T12:00:00Z",
        "updatedAt": "2023-01-01T12:00:00Z"
      },
      // ... other classes
    ]
  }
  ```

#### 2. Create Class
- **Endpoint:** `POST /api/class`
- **Description:** Create a new class.
- **Expected Input:**
  ```json
  {
    "name": "Science",
    "_schoolId": "school_id_2"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "class": {
      "id": 2,
      "name": "Science",
      "_schoolId": "school_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 3. Get Class by ID
- **Endpoint:** `GET api/class/:id`
- **Description:** Retrieve details of a specific class.
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "class": {
      "id": 2,
      "name": "Science",
      "_schoolId": "school_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 4. Update Class
- **Endpoint:** `PATCH api/class/:id`
- **Description:** Update information for a specific class.
- **Expected Input:**
  ```json
  {
    "name": "Updated Science",
    "_schoolId": "updated_school_id"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "class": {
      "id": 2,
      "name": "Science",
      "_schoolId": "school_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 5. Delete class
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a specific class.
- **Expected Output (Example):**
  ```json
  {"status": 200}
  ```


### School Endpoints:

#### 1. Get All Schools
- **Endpoint:** `GET /api/school`
- **Description:** Retrieve a list of all schools.
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "schools": [
      {
        "id": 1,
        "name": "ABC School",
        "createdAt": "2023-01-01T12:00:00Z",
        "updatedAt": "2023-01-01T12:00:00Z"
      },
      // ... other schools
    ]
  }
  ```

  #### 2. Create School
- **Endpoint:** `POST /api/school`
- **Description:** Create a new school.
- **Expected Input:**
  ```json
  {
    "name": "XYZ School"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "school": {
      "id": 2,
      "name": "XYZ School",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 3. Get school by ID
- **Endpoint:** `GET api/school/:id`
- **Description:** Retrieve details of a specific school.
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "school": {
      "id": 2,
      "name": "XYZ School",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 4. Update School
- **Endpoint:** `PATCH api/school/:id`
- **Description:** Update information for a specific school.
- **Expected Input:**
  ```json
  {
    "name": "Updated XYZ School"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "class": {
      "id": 2,
      "name": "Science",
      "_schoolId": "school_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 5. Delete school
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a specific class.
- **Expected Output (Example):**
  ```json
  {"status": 200}
  ```

### Student Endpoints:

#### 1. Get All Students
- **Endpoint:** `GET /api/student`
- **Description:** Retrieve a list of all students.
- **Expected Output (Example):**
```json
{
  "status": 200,
  "students": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "birthdate": "2000-01-01",
      "_classId": "class_id_1",
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    },
    // ... other students
  ]
}
```

#### 2. Create Student
- **Endpoint:** `POST /api/student`
- **Description:** Create a new student.
- **Expected Input:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "birthdate": "2001-02-02",
    "_classId": "class_id_2"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "student": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Doe",
      "birthdate": "2001-02-02",
      "_classId": "class_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 3. Get Student by ID
- **Endpoint:** `GET api/student/:id`
- **Description:** Retrieve details of a specific student.
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "student": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Doe",
      "birthdate": "2001-02-02",
      "_classId": "class_id_2",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 4. Update Student
- **Endpoint:** `PATCH api/student/:id`
- **Description:** Update information for a specific student.
- **Expected Input:**
  ```json
  {
    "firstName": "Updated Jane",
    "lastName": "Updated Doe",
    "birthdate": "2001-02-02",
    "_classId": "updated_class_id"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "student": {
      "id": 2,
      "firstName": "Updated Jane",
      "lastName": "Updated Doe",
      "birthdate": "2001-02-02",
      "_classId": "updated_class_id",
      "createdAt": "2023-04-15T12:00:00Z",
      "updatedAt": "2023-04-15T12:00:00Z"
    }
  }
  ```

#### 5. Delete student
- **Endpoint:** `DELETE /:id`
- **Description:** Delete a specific student.
- **Expected Output (Example):**
  ```json
  {"status": 200}
  ```

### User Endpoints:

#### 1. Sign Up
- **Endpoint:** `POST /api/user/signup`
- **Description:** Create a new user account.
- **Expected Input:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "password": "password123",
    "schoolName": "ABC School"
  }
  ```

  #### 2. Login
- **Endpoint:** `POST /api/user/login`
- **Description:** Log in to an existing user account.
- **Expected Input:**
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "message": "User logged in successfully",
    "token": "jwt_token_here"
  }
  ```

#### 3. Change User Role
- **Endpoint:** `PUT /api/user/changerole`
- **Description:** Change the role of a user (requires superadmin privileges).
- **Expected Input:**
  ```json
  {
    "username": "johndoe",
    "role": "superadmin"
  }
  ```
- **Expected Output (Example):**
  ```json
  {
    "status": 200,
    "message": "User role changed successfully",
    "user": {
      "_id": "user_id_here",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "role": "superadmin",
      "_schoolId": "school_id_here",
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    }
  }
  ```





