import React, {useState, useEffect, useRef, useCallback } from "react";
import {useHistory} from 'react-router-dom'
import {
  Button,
  TextField
} from '@material-ui/core';

import EmailEditor from "react-email-editor";
import { store } from 'react-notifications-component';

import ExportHTMLPopup from 'components/ExportHtmlPopup'
import endpoints from 'endpoints.json';
import axios from 'axios';

import "./email-editor.css";

const CustomEmailEditor = () => {
  let [editorProps,setEditorProps] = useState({
    appearance:{
      theme:'light',
      panels:{
        tools:{
          dock:'left'
        }
      }
    }
  })
  let [editor,setEditor] = useState(null);
  let [template,setTemplate] = useState({});
  let [draft,setDraft] = useState(null);
  let [html,setHTML] = useState('');
  let [title,setTitle] = useState('');
  let [popupOpen,setPopupOpen] = useState(false);
  let notificationOptions={
    insert: "top",
    container: "top-center",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 4000,
    }
  }

  const showNotification = (name,message,type) =>{
    store.addNotification({
      ...notificationOptions,
      title:name,
      message,type,
    });
  }



  const emailEditorRef = useCallback((node)=>{
    console.log('ref callback',node)
    
    setEditor(node)
  });
  const history = useHistory()
  
  const handleTitleChange = ev=>{
    setTitle(ev.target.value)
  }
  const exportHtml = () => {
    editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
      setHTML(html);
      setPopupOpen(true)
    });
  };

  const createTemplate = async (design) =>{
    console.log('creating...')
    try{
      let shop = localStorage.getItem('shop')
      const payload = {title,shop,design_json:JSON.stringify(design)}
      let res = await axios.post(endpoints.createTemplate,payload)
      if(res.data.created){
        console.log("create res",res)
        showNotification('Created!',"Templated Created Successfully",'success')
        return res.data.template
      }
      showNotification('Failed',"Template was not created. Please Try Again Later !",'danger')
    }
    catch(err){
      console.log("error creating ",err)
      showNotification('Failed',"There was some error creating template. Please Try Again Later !",'danger')
      return false
    }
  }

  const updateTemplate = async (design) => {
    console.log('updating ...',template)
    try{
      const payload = {title,design_json:JSON.stringify(design)}
      const id =template._id ;
      console.log("id",id)
      let res = await axios.put(endpoints.updateTemplate+id,payload)
      if(res.data.updated){
        showNotification('Updated!',"Templated Updated Successfully",'success')
        return true
      }
      showNotification('Failed',"Template was not updated. Please Try Again Later !",'danger')
    }
    catch(err){
      console.log("error creating ",err)
      showNotification('Failed',"There was some error updating the template. Please Try Again Later !",'danger')
      return false
    }
  }

  const saveDesign = async () => {
    if(title===""){
      showNotification('Enter Title',"Title cannot be empty. Please type a title for template",'danger')
      return 
    }
    editor.saveDesign( async (design) => {
      console.log("saveDesign");
      //Upload design to MONGODB`
      if(Object.keys(template).length>0 && template._id ) await updateTemplate(design)
      else {
        let created_template = await createTemplate(design)
        if(created_template){
          console.log("created temp",created_template)
          setTemplate(created_template)
        }

      }
      setDraft(null)
      
      
    });
  };
  const saveDraft = ()=>{
    console.log("Saving Draft",draft)
    localStorage.setItem('draft',JSON.stringify(draft))
  }
  const onLoad = () => {  
    let LoopsLeft = 10;
    let LoopingInterval = 500;
    let interval = setInterval(() => {
      // console.log('onLoad')
      if (LoopsLeft <= 0) return;
      if (editor != null) {
        
        clearInterval(interval);

        if(editor && editor!=null){
          if(Object.keys(template).length>0 ){
            console.log('loading design',template)
            const templateJson = JSON.parse(template.design_json);
            editor.loadDesign(templateJson);
          }
          editor.addEventListener('design:updated', (data) => {
            editor.saveDesign(design=>{
              let d = new Date();
              console.log("change")
              if(template && template._id) setDraft({...template,title,design_json:JSON.stringify(design), createdAt:d.toISOString(),updatedAt:d.toISOString()})
              else {
                setDraft({title,design_json:JSON.stringify(design), createdAt:d.toISOString(),updatedAt:d.toISOString()})
              }
            })      
          });
        }

      }
      else {
        LoopsLeft--;
      }
    }, LoopingInterval);
  }

  useEffect(()=>{
    if(editor!=null) onLoad()
  },[editor])
  useEffect(()=>{
    setDraft({...draft,title})
  },[title])

  useEffect(()=>{
    console.log('draft ',draft)

    return ()=>{
      console.log("return useEffect[]",draft)
      saveDraft()
    }
  },[draft])

  useEffect(()=>{
    console.log("useEffect[] ",history.location.state)
    if(history.location.state ){
      console.log("Template found")
      let updatedTemplate = history.location.state.template
      setTemplate(updatedTemplate)
      setTitle(updatedTemplate.title)
    }
    setDraft(JSON.parse(localStorage.getItem('draft')))
  },[])
  
  return (
    <div className="">
      <ExportHTMLPopup html={html} title={title} open={popupOpen} setOpen={setPopupOpen} />
      <div className="title-bar" >
        <TextField
          className="title-field"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          InputProps={{
            placeholder:"Template Title",
            style: {
              fontSize: "2rem",
              padding: ".25rem 0rem",
            },
          }}
        />
        <div className="editor-controls">
          <Button variant="contained" color="primary" onClick={exportHtml}>Export HTML</Button>
          <Button variant="contained" color="primary" onClick={saveDesign}>Save Design</Button>
        </div>
      </div>
      <EmailEditor 
        ref={emailEditorRef} 
        onLoad={onLoad} 
        {...editorProps}
        style={{
          height:'calc(100vh - 6rem)'
        }} 
      />
    </div>
  );
};

export default CustomEmailEditor;
