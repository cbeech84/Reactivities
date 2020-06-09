import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from '../layout/LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);
    
  if (activityStore.loadingInitial) return <LoadingComponent content={'Loading activities...'}/>
  

  //note: you can only return a single element, not sibling elements - you could use <div></div> to achieve this, or a react fragment instead.
  return (
    <Fragment> 
      <NavBar/>
      <Container style={{marginTop : '7em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
    );
}

export default observer(App);
