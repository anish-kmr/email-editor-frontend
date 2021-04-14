import React, { useEffect } from 'react'
import {useHistory} from 'react-router-dom';
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
                    alert('Access Token Set')
                    history.push('/')
                }
                else{
                    alert("Auth Failed")
                }
            })
            .catch(err=>{
                alert('error getting access token')
                console.log("Error",err)
            })
        }
        else{
            console.log("authg failed")
            alert("Auth Failed")
        }
    },[])
     return (
        <div>
            Auth Successfull ! Hurray....
        </div>
    )
}
 
export default AuthCallback