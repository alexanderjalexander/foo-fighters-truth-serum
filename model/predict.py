import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import pandas as pd
import numpy as np
from io import StringIO
import tensorflow as tf
tf.get_logger().setLevel('INFO')
import keras

data = pd.read_csv(StringIO(input()), header=None).to_numpy().reshape((1,1,5)).astype(np.float32)
model = keras.models.load_model("seq18.keras")
result = model.predict(data)

print("truth" if result[0][1] > result[0][0] else "lie")
