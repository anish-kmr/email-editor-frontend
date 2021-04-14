import React,{useState, useEffect} from 'react'
import TemplateItem from 'components/TemplateItem'

import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import './drafts.css'

const Drafts = () => {
    let [draft,setDraft] = useState(JSON.parse(localStorage.getItem('draft')))
    const handleDelete = (id)=>{
        localStorage.removeItem('draft');
        setDraft(null)
    }
    useEffect(()=>{
        setDraft(JSON.parse(localStorage.getItem('draft')))
    },[])
    return (
        <div className="drafts-container" >
            <div className="draft-header">Drafts </div>
            <div className="helper-text">
                <LiveHelpIcon color="secondary" style={{width:"3rem",height:"3rem"}}/>
                <span>Your unsaved Templates will appear here as Drafts. Note that only one draft can be saved at a time , the template on which you are currently working. Previous draft will be overwritten with new one. </span>
            </div>
            {
                draft && 
                (
                    <TemplateItem
                        id={draft._id}
                        title={draft.title}
                        design_json={draft.design_json}
                        createdAt={draft.createdAt}
                        updatedAt={draft.updatedAt}
                        handleDelete={handleDelete}
                    /> 
                )
            }
            
        </div>
    )
}
 
export default Drafts