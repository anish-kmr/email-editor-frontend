//react import 
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

//Components imports
import AuthCallback from 'components/AuthCallback'
import Main from 'components/Main'
//Third Party imports

import './app.css';

const App = () => {
  return (
    <div className="App">
       <Switch>
          <Route exact path='/auth/callback' component={AuthCallback} />
          <Route path='/' component={Main} />
        </Switch>
    </div>
  );
}

export default App;
