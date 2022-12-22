import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import numpy as np
import os

st.set_page_config(
    page_title="Crop Disease Identification", 
    page_icon="🌿", 
    layout="wide", 
    initial_sidebar_state="auto", 
    menu_items=None
)

st.title("Hierarchical Confusion Matrix of PlantVillage")

st.markdown(
    """
    <p align="justify">
    A confusion matrix is a visualization tool in machine learning to help people to evaluate the performance of a classification model.
    It is a tabular layout that compares predicted class labels against actual class labels over all data instances.
    The rows of the matrix represent the actual classes, while the columns represent the predicted classes.
    By analyzing the confusion matrix, we can determine how well the model is able to distinguish between different classes, as well as which classes are most often confused with one another.
    Popular performance metrics, such as accuracy, precision, recall, F-1 score could be derived from the confusion matrix.

    The PlantVillage dataset has a tree-like hierarchical structure with three levels.
    The root node is the overall category, plant.
    The first level is the 14 specific plant species.
    The second level is the healthy or disease status of the particular plant.
    Thus we use hierarchical confusion matrix to capture the hierarchical structure in the dataset.

    The following is an interactive widget to visualize the hierarchical confusion matrix of the FoldNet model when evaluating on the 10861 testing images of the PlantVillage dataset.
    </p>
    """,
    unsafe_allow_html=True
)

components.iframe("https://autofarm2.vercel.app/", height=1200)

st.markdown(
    """
    <p align="justify">
    The FoldNet model achieves 99.84% accuracy, with only 17 images are classified incorrectly.
    After quantitatively analyzing these 17 images, we find three interesting points need to be noted:

    First, compared to incorrect classification within the same species, incorrect classification across species are very rare.
    Only 5 images are incorrectly identified as images of different plant species, while the other 12 images are identified correctly as to their species, even though incorrectly as to their disease status.
    This reflects the robustness of the FoldNet model, which can correctly predict the species of a image even if its prediction of the image's disease status is wrong.

    Second, the 12 images that are incorrectly classified within the same species belong to two species, corn and tomato. 4 of the 12 images belong to corn, while the other 8 images belong to tomato.
    This reflects the complexity of the images of corn and tomato.

    Third, for the 17 images that are classified incorrectly
    
    </p>
    """,
    unsafe_allow_html=True
)

root_dir = "data/results/plantvillage/"
across_species = [
    ("Cherry___healthy/image_(100).JPG", "Cherry Healthy", "Soybean healthy"),
    ("Cherry___healthy/image_(304).JPG", "Cherry Healthy", "Strawberry Leaf scorch"),
    ("Orange___Haunglongbing_(Citrus_greening)/image_(167).JPG", "Orange Citrus Greening", "Tomato Late blight"),
    ("Tomato___Early_blight/image_(786).JPG", "Tomato Early blight", "PepperBell Bacterial spot"),
    ("Tomato___Tomato_Yellow_Leaf_Curl_Virus/image_(1927).JPG", "Tomato Yellow Leaf Curl", "Squash Powdery mildew")
]

cols = st.columns(5)
for col, (img, act, pred) in zip(cols, across_species):
    col.caption("Actual : " + act)
    col.caption("Predict: " + pred)
    col.image(os.path.join(root_dir, img))

st.write("<p align='center'>Figure 1, the 5 images that are incorrectly predicted as images of other plant species.</p>", unsafe_allow_html=True)

cron_species = [
    ("Corn___Cercospora_leaf_spot/image_(319).JPG", "Corn Cercospora leaf spot", "Corn Northern Leaf Blight"),
    ("Corn___Common_rust/image_(532).JPG", "Corn Common rust", "Corn Cercospora leaf spot"),
    ("Corn___Northern_Leaf_Blight/image_(347).JPG", "Corn Northern Leaf Blight", "Corn Cercospora leaf spot"),
    ("Corn___Northern_Leaf_Blight/image_(437).JPG", "Corn Northern Leaf Blight", "Corn Cercospora leaf spot"),
]

cols = st.columns(4)
for col, (img, act, pred) in zip(cols, cron_species):
    col.caption("Actual : " + act)
    col.caption("Predict: " + pred)
    col.image(os.path.join(root_dir, img))

st.write("<p align='center'>Figure 2, the 4 images of cron that are incorrectly predicted within the same species.</p>", unsafe_allow_html=True)

tomato_species = [
    ("Tomato___Tomato_Yellow_Leaf_Curl_Virus/image_(2145).JPG", "Tomato Yellow Leaf Curl", "Tomato Late blight"),
    ("Tomato___Tomato_Yellow_Leaf_Curl_Virus/image_(2701).JPG", "Tomato Yellow Leaf Curl", "Tomato Bacterial spot"),
    ("Tomato___Early_blight/image_(423).JPG", "Tomato Early blight", "Tomato Spider mites"),
    ("Tomato___Early_blight/image_(683).JPG", "Tomato Early blight", "Tomato Septoria leaf spot"),
    ("Tomato___Late_blight/image_(1178).JPG", "Tomato Late blight", "Tomato Bacterial spot"),
    ("Tomato___Late_blight/image_(790).JPG", "Tomato Late blight", "Tomato Early blight"),
    ("Tomato___Late_blight/image_(1605).JPG", "Tomato Late blight", "Tomato Healthy"),
    ("Tomato___Target_Spot/image_(669).JPG", "Tomato Target spot", "Tomato Spider mites"),
]

n_cols = 4
n_pics = 8
n_rows = int(1 + n_pics // n_cols)
rows = [st.columns(n_cols) for _ in range(n_rows)]
cols = [col for row in rows for col in row]

# cols = st.columns(8)
for col, (img, act, pred) in zip(cols, tomato_species):
    col.caption("Actual : " + act)
    col.caption("Predict: " + pred)
    col.image(os.path.join(root_dir, img))

st.write("<p align='center'>Figure 3, the 8 images of cron that are incorrectly predicted within the same species.</p>", unsafe_allow_html=True)

