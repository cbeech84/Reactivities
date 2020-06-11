import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from '../dashboard/ActivityList';
// import ActivityDetails from '../details/ActivityDetails';
// import ActivityForm from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'
import LoadingComponent from '../../../app/layout/LoadingComponent';

export const ActivityDashboard: React.FC = () => {  //destructure the properties of IProp for use below
    //const activityStore = useContext(ActivityStore); //get the activitystore here
    //const {editMode, activity} = activityStore; //destructure the required properties
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);
        
    if (activityStore.loadingInitial) return <LoadingComponent content={'Loading activities...'}/>
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity Filter</h2>
                {/* {activity && !editMode && (
                  <ActivityDetails />
                )} */}
                {/* // the above will only display if there is a selectedActivity AND we are not in editMode*/}
                {/* {editMode && <ActivityForm
                  // eslint-disable-next-line
                  key={activity && activity.id || 0}
                  activity={activity!}
                />} */}
                {/* ActivityForm only if we are in editMode */}
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);