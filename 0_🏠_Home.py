import streamlit as st

st.set_page_config(
    page_title="Crop Disease Identification", 
    page_icon="🌿", 
    layout="wide", 
    initial_sidebar_state="auto", 
    menu_items=None
)

# st.title("Welcome to the Project of  Plant Disease Identification in Precision Farming! 🌿")

st.markdown(
"""
# Welcome to Deep Learning in Precision Farming! 🌿

<p align='justify'>
<font size='5'>
The aim of this project is to use deep learning models such as Convolutional Neural Networks (CNN) to identify plant diseases, and deploy such models to agricultural robots.
</font>
</p>

### What is plant disease identification in precision farming?

<p align="justify">
<font size='5'>
Precision farming is a type of agriculture that uses advanced technology and data analysis to make precise, targeted decisions about planting, fertilizing and managing crops, to optimize crop production and increase efficiency.
</font>
</p>

<p align="justify">
<font size='5'>
Plant disease identification is a core task in precision farming, which is the process of identifying different types of plant diseases in order to better understand and manage them.
The goal of identifying plant diseases could be divided to two levels, image classification and object detection, which suit to different scenarios. 
Image classification helps us to categorize **what** is contained in an image, while object detection in addition locate **where** is the objects in an image.
</font>
</p>

<p align="justify">
<font size='5'>
Plant disease identification can be done using a variety of techniques, one of which is machine learning, especially deep learning algorithms. In this project, we will use deep learning to identify, classify and specify different types of plant diseases based on their images.
Once plant diseased have been classified, farmers can take targeted actions such as applying pesticides or using biological control methods to prevent or treat the diseases, which can help improve crop yields and reduce the need for chemical and other inputs.
</font>
</p>


""",
unsafe_allow_html=True
)

st.image('classify_and_detect.jpg', caption="Figure 1, classification and detection of plant diseases")

st.markdown(
"""

### How to apply deep learning in plant disease identification?

<p align="justify">
<font size='5'>
Deep learning is a type of machine learning that involves the use of neural networks to learn to identify patterns and make predictions based on large amounts of data.
In the context of plant disease classification, deep learning can be used to automatically identify and classify different types of plant diseases based on images or other data.
This can be done by training a deep learning model on a large dataset of labeled plant disease images, where each image is assigned a specific disease category.
</font>
</p>

Once the model has been trained, it can be used to classify new plant disease images.
Some potential applications of deep learning in plant disease classification include early detection and identification of diseases, monitoring of disease outbreaks, and development of predictive models for disease management.

### Contents of the project

This project try to develop a plant disease classification app in precision farming following the steps below:

1. Explore a public plant disease dataset: PlantVillage  📗
2. Propose an isotropic convolutional neural network model: FoldNet
3. Train the FoldNet model to learn the PlantVillage dataset
4. Analyze the performance from the angle of hierarchical confusion matrix
5. Deploy the FoldNet model to cloud to predict plant diseases
6. Deploy the FoldNet model to a mobile platform

### Highlights of the project

- A tiny model with only 0.675M parameters achieves 99.83\% accuracy on the PlantVillage dataset
- A hierarchical confusion matrix to visualize the performance of the FoldNet model on the PlantVillage dataset
- 

</p>

""",
unsafe_allow_html=True
)

# <a href="PlantVillage" target="_self">PlantVillage</a>
# [PlantVillage](PlantVillage)
