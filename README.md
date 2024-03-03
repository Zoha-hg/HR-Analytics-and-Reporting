# HR-Analytics-and-Reporting
HR Analytics and Reporting Group-16

Ensure you have the following software installed on your machine:

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)

## Installation

1. Clone this repository to your local machine using Git:
    git clone https://github.com/Zoha-hg/HR-Analytics-and-Reporting.git

2. Navigate into the project directory:
    cd HR-Analytics-and-Reporting

3. Install dependencies in the root directory:
    npm install

4. Install dependencies in the backend folder:
    cd backend
    npm install

5. The directory structure is as follows:
    - HR-Analytics-and-Reporting
        - backend
            - This contains all the backend components.
                - Routes
                - Models
                - Email API
                - server.js
        - public
        - src
            - This contains all the front-end components
                - components
                    - Includes all the pages used in the app
                - Contains the App.js file along with files used for authentication of tokens.
        

## Running the Application

1. Start the MongoDB server.

2. Start the backend server:
    cd ../backend
    npm start

4. Access the application in your web browser:
    ```plaintext
    http://localhost:3000/

## Contributing

- Before contributing, make sure to create a separate branch and work there:
    git checkout -b your-branch-name

- Do not merge directly into main, when a task is completed, push to your branch and create a pull request to wait for it to be merged.
