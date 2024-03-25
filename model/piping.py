import random
import numpy as np
import keras

def get_model():
    #  build a simple model (PLACEHOLDER)
    inputs = keras.Input(shape=(32,))
    outputs = keras.layers.Dense(1)(inputs)
    model = keras.Model(inputs, outputs)
    model.compile(optimizer=keras.optimizers.Adam(), loss="mean_squared_error")
    return model


#  The Keras API saves all of these pieces together in a unified format, marked by the .keras extension.
#  This is a zip archive consisting of the following:
#       -  A JSON-based configuration file (config.json): Records of model, layer, and other trackables' configuration.
#       -  A H5-based state file, such as model.weights.h5 (for the whole model), with directory keys for layers and their weights.
#       -  A metadata file in JSON, storing things such as the current Keras version.

model = get_model()                                              #  get model (Sequential, Functional Model, or Model subclass)
model.save("my_model.keras", save_format="h5")                   #  creates a zip archive called "my_model.keras" (.keras extension required)
model = keras.models.load_model("my_model.keras")                #  load the model back
reconstructed_model = keras.models.load_model("my_model.keras")  #  you can reconstruct an identical model

#  train the model
# test_input = np.random.random((128, 32))
test_input = input()
test_target = np.random.random((128, 1))

model.fit(test_input, test_target)

#  unit testing
np.testing.assert_allclose(
    model.predict(test_input), reconstructed_model.predict(test_input)
)

#  this file outputs "Truth" or "Lie" to stdout, depending on the prediction of the model
if(random.randint(0, 1) == 1):
    print("Truth")
else:
    print("Lie")
