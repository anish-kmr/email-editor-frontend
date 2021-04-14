import React from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import GetAppIcon from '@material-ui/icons/GetApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import './export_html.css'

const ExportHtmlPopup = ({title, html,open,setOpen}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(html)
    }
    const downloadFile = () => {
        const element = document.createElement("a");
        const file = new Blob([html], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = title || "template.txt";
        document.body.appendChild(element); 
        element.click();
      }
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={()=>{setOpen(false)}}
        >
        <DialogTitle>
            <div className="popup-title-bar">
                <h2>Template HTML</h2>
                <div className="popup-controls">
                    <Button onClick={downloadFile}>
                        <GetAppIcon style={{width:'2.5rem',height:'2.5rem'}} />
                    </Button>
                    <Button onClick={copyToClipboard}>
                        <FileCopyIcon style={{width:'2.5rem',height:'2.5rem'}} />
                    </Button>
                </div>
            </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="popup-content">
            {html}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="close-btn">
          <Button color="primary" variant="contained" onClick={()=>setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
}
 
export default ExportHtmlPopup