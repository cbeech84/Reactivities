import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from '../dashboard/ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'

export const ActivityDashboard: React.FC = () => {  //destructure the properties of IProp for use below
    const activityStore = useContext(ActivityStore); //get the activitystore here
    const {editMode, selectedActivity} = activityStore; //destructure the required properties
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && (
                  <ActivityDetails />
                )}
                {/* // the above will only display if there is a selectedActivity AND we are not in editMode*/}
                {editMode && <ActivityForm
                  // eslint-disable-next-line
                  key={selectedActivity && selectedActivity.id || 0}
                  activity={selectedActivity!}
                />}
                {/* ActivityForm only if we are in editMode */}
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);