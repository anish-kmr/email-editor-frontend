//react import 
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

//Components imports
import AuthCallback from 'components/AuthCallback'
import Main from 'components/Main'
//Third Party imports
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './app.css';

const App = () => {
  return (
    <div className="App">
      <ReactNotification />
       <Switch>
          <Route exact path='/auth/callback' component={AuthCallback} />
          <Route path='/' component={Main} />
        </Switch>
    </div>
  );
}

export default App;
