import React from 'react'
import {useHistory} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Avatar
} from '@material-ui/core';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

import './template_item.css'

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
  },
  cardContent: {
    position: "relative",
    padding: "0.75rem 1.5rem",
  },
  cardActions: {
    display: "flex",
    justifyContent:'space-between',
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
  },
  createdAt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    paddingTop: "1rem",
    fontSize: "1.4rem",
  },
});

const TemplateItem = ({id,title,design_json,createdAt, updatedAt, handleDelete}) => {
    const classes = useStyles();
    const history = useHistory();
    const handleEdit = ()=>{
        console.log("going state ",{template:{_id:id,title,design_json,createdAt,updatedAt}})
        history.push({
            pathname:'/email-editor',
            state:{template:{_id:id,title,design_json,createdAt,updatedAt}}
        })
    }
    const formatTime = (time) => {
        if(time==null) return
        let [date,t] = time.split('T')
        t = t.split(':').splice(0,2)
        console.log(date,t)
        return `${t[0]}:${t[1]}, ${date}`

    }   

     return (
         <>
        <div className="template-conteiner" >
            <div className="detail-section" onClick={handleEdit} >
                <div className="template-icon">
                    <InsertDriveFileIcon  style={{color:"#fff",width:'3rem',height:"3rem"}}/>
                </div>
                <div className="details">
                    <div className="title">{title || 'Untitled Template'}</div>
                    <div className="created">{formatTime(createdAt)}</div>
                </div>
                <div className="edit-btn">
                  <EditIcon style={{color:"#fff",width:'2.5rem',height:'2.5rem'}} />
                </div>

            </div>

            <div className="controls" onClick={()=>handleDelete(id)}>
                <DeleteIcon  style={{color:"#fff",width:'2.5rem',height:'2.5rem'}}/>
            </div>
            
        </div>
        </>
    )
}
 
export default TemplateItem