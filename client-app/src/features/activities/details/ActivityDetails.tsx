import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match}) => { //in order to load the activity, we take the ID from the route's parameters (but we create a custom params interface to tell React about the custom id)
  const rootStore = useContext(RootStoreContext);
  const {activity, loadActivity, loadingInitial} = rootStore.activityStore; //destructure the required properties

  useEffect(() => {
    loadActivity(match.params.id) //catch statement removed as no longer needed, as we are not handling the error here anymore
  },[loadActivity, match.params.id]); //dependency is set here because we only want the activity to load once, when the component is mounted.

  if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...'/>

  if (!activity)
    return <h2>Activity not found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar attendees={activity.attendees}/>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails)