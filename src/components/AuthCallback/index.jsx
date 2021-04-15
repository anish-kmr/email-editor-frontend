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
    const removeHmacFromParams = (params) => {
        let paramsList=[]
        for (const [key, value] of Object.entries(params)) {
            if(key !== "hmac") paramsList.push(`${key}=${value}`)
        }
        return paramsList.join('&')
    }
    useEffect(()=>{
        const regex = /[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/ 
        
        const hash = sha256.hmac.create(process.env.REACT_APP_SHOPIFY_API_SECRET);
        const queryWithoutHmac = removeHmacFromParams(params);
        console.log(queryWithoutHmac)
        hash.update(queryWithoutHmac)
        console.log(params.state === "123456")
        console.log(hash.hex() === params.hmac)
        console.log(regex.test(params.shop))
        if(
            params.state === "123456" &&   //Verifying if the state set during authentication is same 
            hash.hex() === params.hmac &&  // Verifying the hmac of params(code, shop, state, timestamp)
            regex.test(params.shop)        // Verifying that shop name follows valid shopify domain
        ){
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
            Authenticating...
        </div>
    )
}
 
export default AuthCallback