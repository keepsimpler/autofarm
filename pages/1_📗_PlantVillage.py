import streamlit as st
import pandas as pd
from st_aggrid import AgGrid
import os

st.set_page_config(
    page_title="Crop Disease Identification", 
    page_icon="🌿", 
    layout="wide", 
    initial_sidebar_state="auto", 
    menu_items=None
)

st.title("The PlantVillage Dataset")

st.markdown(
"""
<p align="justify">
<font size="4">
The PlantVillage dataset is a collection of 54,305 images of 14 different plant species, belonging to 38 classes, 12 of which are healthy, 26 of which are diseased.

The dataset was created by the Penn State College of Agricultural Sciences and the International Institute of Tropical Agriculture as a resource for research and development of computer vision-based plant disease detection systems.
The images in the dataset were collected from various sources, including research institutions and citizen scientists, and represent a wide variety of plant species and disease types.
</font>
</p>
""",
unsafe_allow_html=True
)

# st.markdown(
#     """
#     <style>
#     metric {
#         font-size: 1rem !important;
#     }
#     </style>
#     """,
#     unsafe_allow_html=True
# )

col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Images", "54305")
col2.metric("Plants", 14)
col3.metric("Classes", "38")
col4.metric("Healthy", "12")
col5.metric("Diseases", 26)

st.markdown(
"""
<p align="justify">
<font size="4">
The plants include fruits such as apple, blueberry, cherry, grape, orange, peach, raspberry, squash, strawberry and crops such as corn, soybean and vegetables such as pepper bell, potato, tomato.
Each plant is in healthy status or in disease such as scab, rot, rust, and so on.
</font>
</p>
""",
unsafe_allow_html=True
)

df = pd.read_csv('plantvillage/cls_count.csv')
# df = df.drop(columns=['cls'])
grid_options = {
    "columnDefs": [
        { "field": 'crop', "headName": "Crop", "rowGroup": True, "hide": True},
        { "field": 'disease', "headName": "Disease"},
        { "field": 'count', "headName": "Number of Images", "sortable": True},
    ],
}

df_aggrid = AgGrid(df, grid_options, height=450, allow_unsafe_jscode=False, fit_columns_on_grid_load=True)['data']

st.markdown(
"""
<p align="justify">
<font size="4">
The number of images of all the different types of plants are different with each other.
Such a skewed distribution of the number of images in a dataset is called imbalanced.
A imbalanced dataset is more difficult to train then a balanced dataset.

</font>
</p>
""",
unsafe_allow_html=True
)

st.bar_chart(df, y = "count")

st.markdown(
"""
<p align="justify">
<font size="4">
Last, let us show example images of 38 classes. You could click the button below to show more examples.
</font>
</p>
""",
unsafe_allow_html=True
)

# Initialize state
if 'seed' not in st.session_state:
    st.session_state['seed'] = 0

if st.button("Show more examples"):
    st.session_state['seed'] = (st.session_state['seed'] + 1) % 3
# st.text(st.session_state['seed'])

n_cols = 6
n_pics = 38
n_rows = int(1 + n_pics // n_cols)
rows = [st.columns(n_cols) for _ in range(n_rows)]
cols = [col for row in rows for col in row]

root_dir = "plantvillage"
samples = []
classes = os.listdir(root_dir)
for cls in classes:
    cls_path = os.path.join(root_dir, cls)
    if os.path.isdir(cls_path):
        for img_name in os.listdir(cls_path):
            img_path = os.path.join(cls_path, img_name)
            samples.append((img_path, cls))

for col, (img, cls) in zip(cols, samples[st.session_state['seed']::3]):
    # col.caption(cls)
    col.image(img)
