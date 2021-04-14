import React,{useState, useEffect} from 'react'

import TemplateItem from 'components/TemplateItem';


import LiveHelpIcon from '@material-ui/icons/LiveHelp';

import endpoints from 'endpoints.json';
import axios from 'axios';
import './templates.css'


const Templates = () => {
    let [templates, setTemplates] = useState([]) 
    let shop = localStorage.getItem('shop')
    const handleDelete = async (id) => {
        let deleted = await deleteTemplate(id)
        if(!deleted) return
        let index = 0;
        for(let i=0;i<templates.length;i++) {
            if(templates[i]._id === id){
                index=i;
                break
            }
        }
        let updatedTemplates = [...templates]
        updatedTemplates.splice(index,1)
        setTemplates(updatedTemplates)
    }

    const fetchTemplates = async () => {
        try{
            console.log(shop)
            let res = await axios.get(endpoints.getTemplates+shop);
            if(res.data.success) return res.data.templates
            else{
                console.log("fail to fetch ",res.data.error)
                return []
            }
        }
        catch(err){
            console.log("Error fetch templates",err)
            return []
        }
    }
    const deleteTemplate = async (id)=>{
        try{
            let res = await axios.delete(endpoints.deleteTemplate+id);
            if(res.data.deleted) return true
            else{
                console.log("fail to delete",res.data.error)
                return false
            }
        }
        catch(err){
            console.log("Error deleting template",err)
            return false
        }
    }

    useEffect(()=>{
        const initialiseTemplates = async ()=>{
            let templateList = await fetchTemplates();
            setTemplates(templateList) 
            
        }
        initialiseTemplates()
    },[])
    return (
        <div className="templates-container">
            <div className="template-header">Templates </div>
            <div className="helper-text">
                <LiveHelpIcon color="secondary" style={{width:"3rem",height:"3rem"}}/>
                <span>
                    All the saved Templates are listed here. Click on edit icon or the template iteself to start editing the template.
                </span>
            </div>
            <div className="template-list">
            {
                templates.length>0 &&
                templates.map(template=>
                    <TemplateItem 
                        key={template._id}
                        id={template._id}
                        title={template.title}
                        design_json={template.design_json}
                        createdAt={template.createdAt}
                        updatedAt={template.updatedAt}
                        handleDelete={handleDelete}
                    />
                )
            }
            </div>
        </div>
    )
}
 
export default Templates