import React, { useState, useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import axios from 'axios'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]) //useState hook allows you to USE the state
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null) //must declare that the useState for activity can either be an activity or null, or an error will be thrown
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id : string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity =(activity: IActivity) => {
    setActivities([...activities, activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)])
  }

  useEffect(() => { // useEffect will allow you to populate the State
    axios.get<IActivity[]>('http://localhost:5000/api/activities') //gets the list of activities from API
     .then((response) => {
       let activities : IActivity[] = [];
       response.data.forEach(activity => {
         activity.date = activity.date.split('.')[0]
         activities.push(activity)
       })
       setActivities(activities) //this returns an array of the data (as IActivity is an array, and TS is strongly typed)
     });
  }, []); //second array here as a parameter here, so that useEffect runs just once, rather than continuously every time the component renders (via UseState and setActivities).
  //2nd parameter is checked by useEffect, and if they change, then useEffect will run again, so empty array prevents this from happening in this case
    
  //note: you can only return a single element, not sibling elements - you could use <div></div> to achieve this, or a react fragment instead.
  return (
    <Fragment> 
      <NavBar openCreateForm={handleOpenCreateForm}/>
      <Container style={{marginTop : '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectActivity = {handleSelectActivity} 
          selectedActivity = {selectedActivity} //  {selectedActivity!} defines this as an activity or null, but we have changed IProps in ActivityDetails to expect a null
          editMode = {editMode}
          setEditMode = {setEditMode}
          setSelectedActivity = {setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          />
      </Container>
    </Fragment>
    );
}

export default App;
