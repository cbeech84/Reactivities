import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import agent from '../api/agent'
import LoadingComponent from '../layout/LoadingComponent'

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]) //useState hook allows you to USE the state
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null) //must declare that the useState for activity can either be an activity or null, or an error will be thrown
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id : string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity =(activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity])
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then (() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)])
    }).then(() => setSubmitting(false));
  }

  useEffect(() => { // useEffect will allow you to populate the State
    // axios.get<IActivity[]>('http://localhost:5000/api/activities') //gets the list of activities from API
    agent.Activities.list()
     .then((response) => {
       let activities : IActivity[] = [];
       response.forEach(activity => { //we can remove response.data and just use response, since we are returning the responseBody from agent.Activities.list
         activity.date = activity.date.split('.')[0]
         activities.push(activity)
       })
       setActivities(activities) //this returns an array of the data (as IActivity is an array, and TS is strongly typed)
     }).then(() => setLoading(false));
  }, []); //second array here as a parameter here, so that useEffect runs just once, rather than continuously every time the component renders (via UseState and setActivities).
  //2nd parameter is checked by useEffect, and if they change, then useEffect will run again, so empty array prevents this from happening in this case
    
  if (loading) return <LoadingComponent content={'Loading activities...'}/>
  

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
          submitting={submitting}
          target={target}
          />
      </Container>
    </Fragment>
    );
}

export default App;
