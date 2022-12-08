import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import numpy as np

st.set_page_config(
    page_title="Crop Disease Identification", 
    page_icon="🌿", 
    layout="wide", 
    initial_sidebar_state="auto", 
    menu_items=None
)

dataframe = pd.DataFrame(
    np.random.randn(10,20),
    columns=('col %d' % i for i in range(20))
)

st.dataframe(dataframe.style.highlight_max(axis=0))

html_string = "<h3>this is an html string</h3>"

st.markdown(html_string, unsafe_allow_html=True)

components.iframe("https://autofarm2.vercel.app/", height=1200)