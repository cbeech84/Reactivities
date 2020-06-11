import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface DetailParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => { //in order to load the activity, we take the ID from the route's parameters (but we create a custom params interface to tell React about the custom id)
  const activityStore = useContext(ActivityStore); //get the activitystore here
  const {activity, loadActivity, loadingInitial} = activityStore; //destructure the required properties

  useEffect(() => {
    loadActivity(match.params.id)
  },[loadActivity, match.params.id]); //dependency is set here because we only want the activity to load once, when the component is mounted.

  if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...'/>

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity!.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
          <Button onClick={() => history.push('/activities')} basic color='blue' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default observer(ActivityDetails)