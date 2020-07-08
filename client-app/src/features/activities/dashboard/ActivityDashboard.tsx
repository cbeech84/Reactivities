import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from '../dashboard/ActivityList';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

export const ActivityDashboard: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial} = rootStore.activityStore //create the rootStore and destructure the required components from it

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);
        
    if (loadingInitial) return <LoadingComponent content={'Loading activities...'}/>
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