import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {observer} from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({location}) => {
  //note: you can only return a single element, not sibling elements - you could use <div></div> to achieve this, or a react fragment instead.
  return (
    <Fragment>
      <Route exact path='/' component={HomePage}/> {/* add the below in a route expression so it will only render if it is not the homepage*/}
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar/>
          <Container style={{marginTop : '7em'}}>
            <Route exact path='/activities' component={ActivityDashboard}/>
            <Route path='/activities/:id' component={ActivityDetails}/>
            {/* <Route path='/createActivity' component={ActivityForm}/>  this code creates a single endpoint for the component, but the below code shows multiple endpoints for the same component */}
            <Route 
              key={location.key} //we use this key to force React to reload the component whenever the key is different
              path={['/createActivity','/manage/:id']}
              component={ActivityForm}
            />
          </Container>
        </Fragment>
      )} />      
    </Fragment>
    );
}

export default withRouter(observer(App));
