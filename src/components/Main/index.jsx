import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import { Route, Switch } from 'react-router-dom';

import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';


import CustomEmailEditor from 'components/CustomEmailEditor'
import Templates from 'components/Templates'
import Drafts from 'components/Drafts'

import './main.css'

const Main = () => {
    let [navOpen,setNavOpen] = useState(true)
    let [authenticated,setAuthenticated] = useState(false)
    let [askStore,setAskStore] = useState(false)
    let [storeName,setStoreName] = useState('')
    const history = useHistory();
    const query = new URLSearchParams(history.location.search);
    let params = {};
    for (let param of query) {
        params[param[0]] = param[1]
    }
    console.log("params",params)
    console.log("adsfsdaf",process.env.REACT_APP_SHOPIFY_API_KEY)
    

    const redirectToAuth = (store)=>{
        let redirect_uri = process.env.REACT_APP_SHOPIFY_APP_URL+'/auth/callback';
            console.log(redirect_uri)
            let redirect = `https://${store}/admin/oauth/authorize?client_id=${process.env.REACT_APP_SHOPIFY_API_KEY}&scope=${process.env.REACT_APP_SHOPIFY_API_SCOPES}&state=123456&redirect_uri=${redirect_uri}`
            window.location.replace(redirect)
    }

    const continueLogin = ()=>{
        redirectToAuth(storeName+'.myshopify.com')
    } 
    
    useEffect(()=>{
        if(!authenticated && Object.keys(params).length>0) redirectToAuth(params.shop)        
        else if(!localStorage.getItem('access_token')) setAskStore(true)        
        else setAuthenticated(true)        
    },[])
    return (
        <div className="container" >
            {   
                authenticated &&
                <>
                    <Sidebar navOpen={navOpen} setNavOpen={setNavOpen}/>
                    <div className={`main ${!navOpen?'sm_main':'' }`}>
                        <Switch>
                            <Route exact path="/email-editor" component={CustomEmailEditor} />
                            <Route exact path="/drafts" component={Drafts} />
                            <Route exact path="/templates" component={Templates} />
                        </Switch>
                    </div>
                </>
            }
            {
                askStore &&
                <Dialog open={true}>
                    <DialogTitle >
                    <h1>Store Name</h1>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText style={{fontSize:'1.2rem'}}>
                        To visit the Shopify App, please enter your shopify store name here. You will be asked to login to shopify store account.If you dont have an account, go to <a href="https://accounts.shopify.com/store-login">Shopify Login</a> 
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Store Name"
                        fullWidth
                        value={storeName}
                        onChange={(ev)=>setStoreName(ev.target.value)}
                        onKeyDown={e=>{
                            console.log('e',e)
                            if(e.key === "Enter") continueLogin() 
                        }}
                        InputLabelProps={{
                            style:{
                                fontSize:"1.4rem"
                            }
                        }}
                        InputProps={{
                            style:{
                                padding:'0.5rem 1rem',
                                fontSize:'1.6rem',
                            }
                        }}
                    />
                    </DialogContent>
                    <DialogActions style={{padding:'2rem'}} >
                    <Button 
                        onClick={continueLogin} 
                        style={{
                            fontSize:"1.2rem"
                        }}
                        variant="contained" 
                        color="primary" 
                        disabled={storeName.length==0}
                    >
                        Continue
                    </Button>
                    </DialogActions>
                </Dialog>
            }        
        </div>
    )
}
 
export default Main