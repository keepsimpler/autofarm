import streamlit as st

st.set_page_config(
    page_title="Crop Disease Identification", 
    page_icon="🌿", 
    layout="wide", 
    initial_sidebar_state="auto", 
    menu_items=None
)

st.title("Welcome to Plant Disease Identification in Precision Farming! 🌿")

st.markdown(
"""
### What is plant disease classification in precision farming?

<p align="justify">
Precision farming is a method of agriculture that uses technology and data analysis to optimize crop production and increase efficiency. Plant disease classification in precision farming is the process of identifying and categorizing different types of plant diseases in order to better understand and manage them. 

Plant disease classification can be done using a variety of techniques, one of which is machine learning, especially deep learning algorithms. In this project, we will apply deep learning to identify and classify different types of plant diseases based on their images.

Once plant diseased have been classified, farmers can take targeted actions such as applying pesticides or using biological control methods to prevent or treat the diseases, which can help improve crop yields and reduce the need for chemical and other inputs.

### How to apply deep learning in plant disease classification?

Deep learning is a type of machine learning that involves the use of neural networks to learn to identify patterns and make predictions based on large amounts of data.
In the context of plant disease classification, deep learning can be used to automatically identify and classify different types of plant diseases based on images or other data.
This can be done by training a deep learning model on a large dataset of labeled plant disease images, where each image is assigned a specific disease category.
Once the model has been trained, it can be used to classify new plant disease images.
Some potential applications of deep learning in plant disease classification include early detection and identification of diseases, monitoring of disease outbreaks, and development of predictive models for disease management.

### Contents of the project

This project try to develop a plant disease classification app in precision farming through by the following three steps:

1. Explore a public plant disease dataset: PlantVillage  📗
2. Propose an isotropic convolutional neural network model: FoldNet
3. Train the FoldNet model to fit the PlantVillage dataset
4. Analyze the training performance from the angle of confusion matrix
5. Deploy the FoldNet on the cloud to predict plant diseases
6. Deply the FoldNet to a mobile 

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
