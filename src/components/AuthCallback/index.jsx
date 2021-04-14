import React, { useEffect } from 'react'
import {useHistory} from 'react-router-dom';


import { store } from 'react-notifications-component';
import {sha256} from 'js-sha256';
import axios from 'axios'
import endpoints from 'endpoints.json'
import './auth-callback.css'

const AuthCallback = () => {
    const history = useHistory();
    const query = new URLSearchParams(history.location.search);
    let params = {};
    for (let param of query) {
        params[param[0]] = param[1]
    }

    console.log("params",params)
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
    
    useEffect(()=>{
        const regex = /[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/
        const hash = sha256.hmac.create(process.env.REACT_APP_SHOPIFY_API_SECRET);
        hash.update(`code=${params.code}&shop=${params.shop}&state=${params.state}&timestamp=${params.timestamp}`)
        
        if(params.state === "123456" && hash.hex() === params.hmac && regex.test(params.shop) ){
            // alert('Done')
            let payload = {
                shop:params.shop,
                client_id:process.env.REACT_APP_SHOPIFY_API_KEY,
                client_secret:process.env.REACT_APP_SHOPIFY_API_SECRET,
                code:params.code
            }
            console.log(payload)
            axios.post(endpoints.getAccessToken,payload)
            .then(res=>{
                console.log(res)
                if(res.data.success){
                    localStorage.setItem('access_token',res.data.access_token)
                    localStorage.setItem('shop',params.shop)
                    showNotification("Authenticated Successfully","Successfully authenticated! Redirecting...",'success')
                    history.push('/')
                }
                else{
                    showNotification("Authenticated Failed","Failed to authenticate.Try again Later!",'danger')
                }
            })
            .catch(err=>{
                showNotification("Error Authenticating","There was some error getting access token. Please Try again Later!",'danger')
                console.log("Error",err)
            })
        }
        else{
            showNotification("Incorrect Credentials","Shopify didn't authenticated your store either becuase you entered wrong credentials or there it might have been hampered.Please Try again after sometimes.",'danger')
            console.log("authg failed")
        }
    },[])
     return (
        <div>
            Auth Successfull ! Hurray....
        </div>
    )
}
 
export default AuthCallback