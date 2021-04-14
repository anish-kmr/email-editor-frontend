import React,{useState} from 'react'
import TemplateItem from 'components/TemplateItem'
import './drafts.css'

const Drafts = () => {
    let [draft,setDraft] = useState(JSON.parse(localStorage.getItem('draft')))
    console.log(draft)
    let template=null
    if(draft && draft._id){
        template = draft
    }
    const handleDelete = (id)=>{
        localStorage.removeItem('draft');
        setDraft(null)
    }
    return (
        <div className="drafts_container" >
            {
                draft && 
                (
                    template!==null?
                    <TemplateItem
                        id={template.id}
                        title={template.title}
                        design_json={template.design_json}
                        createdAt={template.createdAt}
                        updatedAt={template.updatedAt}
                        handleDelete={handleDelete}
                    /> :
                    <TemplateItem
                        title={draft.title}
                        design_json={draft.design_json}
                        handleDelete={handleDelete}
                    />  
                )
            }
            
        </div>
    )
}
 
export default Drafts