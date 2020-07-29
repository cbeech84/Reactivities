import React, { useContext } from 'react'
import { Tab, Grid, Header, Button } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import ProfileEditForm from './ProfileEditForm';
import LoadingComponent from '../../app/layout/LoadingComponent';

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, editMode, setEditMode, loadingForm } = rootStore.profileStore;

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header 
            floated='left' 
            icon='user'
            content={`About ${profile!.displayName}`}
          />
          {isCurrentUser &&
            <Button
              basic
              floated='right'
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode()}
            />
          }
        </Grid.Column>
        <Grid.Column width={16} >
          {!loadingForm ?
            (editMode ? (
              <ProfileEditForm />
            ) : (
              <span>{profile!.bio}</span>
            )) : (
              <LoadingComponent content={'Loading bio...'}/>
            )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfileAbout)