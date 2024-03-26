import tensorflow as tf
import keras
import tensorflowjs as tfjs

model = keras.models.load_model("seq18.keras")
tfjs.converters.save_keras_model(model, "./")
