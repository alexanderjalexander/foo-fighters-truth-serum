# SSW/CS-555
*Team 9 - Foo() Fighters*

## Project Description
This is a platform for ML-powered lie detection using data from an EEG machine.

## Setup

### Installation
1. Run `npm i` in the `backend` directory
2. Run `npm i` in the `frontend` directory

### Environment
The backend needs a few environment variables to run. `.env` files will be automatically loaded if present. The required variables are as follows:

Variable|Type|Description
-|-|-
CONNECTION_URI|string|A MongoDB connection URI.
DATABASE|string|The name of the database to connect to.

### Running the App
1. Run `npm run build` in the `frontend` directory
2. Run `npm start` in the `backend` directory
3. The application should now be available at `http://localhost:4000/`

## Testing

### ML Model
A prediction can be made for a single data sample by using the predict() function, which simply calculates the dot product of the the model's weights and the data sample.

### Backend
Backend tests can be run by running `npm test` in the `backend` directory.

### Frontend
Frontend tests can be run by running `npm test` in the `frontend` directory.

Before running the frontend tests, ensure that both the frontend and the backend are started and running by running `npm start` in both the `frontend` and `backend` directories. 
