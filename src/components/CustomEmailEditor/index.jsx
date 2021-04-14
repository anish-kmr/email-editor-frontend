import React, {useState, useEffect, useRef, useCallback } from "react";
import {useHistory} from 'react-router-dom'
import {
  Button,
  TextField
} from '@material-ui/core';

import EmailEditor from "react-email-editor";

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
  let [title,setTitle] = useState('');
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
    });
  };

  const createTemplate = async (design) =>{
    console.log('creating...')
    try{
      const payload = {title,shop:'email-editor-task',design_json:JSON.stringify(design)}
      let res = await axios.post(endpoints.createTemplate,payload)
      if(res.data.created){
        console.log("create res",res)
        alert("Saved")
        return res.data.template
      }
    }
    catch(err){
      console.log("error creating ",err)
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
        alert("updated ")
        return true
      }
    }
    catch(err){
      console.log("error creating ",err)
      return false
    }
  }

  const saveDesign = async () => {
    if(title===""){
      alert('Title Cant be empty')
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

        if(Object.keys(template).length>0 && editor && editor!=null){
          console.log('loading design',template)
          const templateJson = JSON.parse(template.design_json);
          editor.loadDesign(templateJson);
          editor.addEventListener('design:updated', (data) => {
            editor.saveDesign(design=>{
              console.log("change")
              if(template) setDraft({...template,title,design_json:JSON.stringify(design)})
              else setDraft({title,design_json:JSON.stringify(design)})
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
    console.log('draft ',draft)
  },[draft])

  useEffect(()=>{
    console.log("useEffect[] ",history.location.state)
    if(history.location.state ){
      console.log("Template found")
      let updatedTemplate = history.location.state.template
      setTemplate(updatedTemplate)
      setTitle(updatedTemplate.title)
    }
    return ()=>{
      console.log("return useEffect[]")
      saveDraft()
    }
  },[])
  
  return (
    <div className="App">
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
