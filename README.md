# SSW/CS-555
*Team 9 - Foo() Fighters*

## Project Description
This is a platform for ML-powered lie detection using data from an EEG machine.

## Setup

### Installation
1. Run `npm i` in the `backend` directory
2. Run `npm i` in the `frontend` directory

### Environment
The backend needs a few environment variables to run. `.env` files will be automatically loaded if present in the `backend` folder. The required variables are as follows:

Variable|Type|Description
-|-|-
CONNECTION_URI|string|A MongoDB connection URI.
DATABASE|string|The name of the database to connect to.

There are also some optional customization variables. They are as follows:

Variable|Type|Description
-|-|-
MAX_FLAGGED|positive integer|The maximum number of detections that can be flagged before refitting is automatically triggered.

### Running the App
1. Run `npm run build` in the `frontend` directory
2. Copy the `build` folder from `frontend` to `backend`
3. Run `npm start` in the `backend` directory
4. The application should now be available at `http://localhost:4000/`

## Testing

### Backend
Backend tests can be run by running `npm test` in the `backend` directory.

### Frontend
Frontend tests can be run by running `npm test` in the `frontend` directory.

Before running the frontend tests, ensure that both the frontend and the backend are started and running by running `npm start` in both the `frontend` and `backend` directories. 

## Exchanging the Model for Another
The model that ships with this repo does not have to be the detection model used by the platform. If switching to another model with the same exact input and output data shape ((N, 9600, 5) and (N, 1, 2) respectively), the only thing that needs to be done is uploading the new model to the `backend/model` folder. If the input and output data shape changed, don't fret; this can still be support through minimal code changes. Only three method have to change (and are marked with `@model` in the source code for easy finding):
1. `backend/validation.js::requireData`: This function checks that the user-uploaded file has the correct data shape and type. It needs to be updated if the input shape/type changes.
2. `backend/data/detections.js::runDetection`: This function runs the model and interprets the output result. It needs to be updated if the output shape changes.
3. `backend/data/detections.js::refit`: This function refits the model with the user-flagged incorrect detections. It needs to be updated if either the input or output shapes change as it uses both pieces of information to execute training epochs.
### Converting a Tensorflow Model For Use With This App
All Tensorflow Keras models work with this app, however they need to be saved in a specialized format. To convert an existing model to this format, the TensorflowJS converter can be used. There is a full article on this process [here](https://www.tensorflow.org/js/tutorials/conversion/import_saved_model);