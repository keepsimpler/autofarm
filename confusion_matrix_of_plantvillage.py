import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title=None, page_icon=None, layout="wide", initial_sidebar_state="auto", menu_items=None)

html_string = "<h3>this is an html string</h3>"

st.markdown(html_string, unsafe_allow_html=True)

components.iframe("https://autofarm2.vercel.app/", height=1200)