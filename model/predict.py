import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import pandas as pd
from io import StringIO
import tensorflow as tf
tf.get_logger().setLevel('INFO')
import tensorflow.keras

model = tensorflow.keras.models.load_model("seq18.h5")
print(model.predict(pd.read_csv(StringIO(input()))))