import React, {Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
import axios from 'axios'
import { IActivity } from '../models/activity';

interface IState {
  activities: IActivity[]
}

class App extends Component<{}, IState> {
  readonly state: IState = { //make this readonly forces you to read this.setState, instead of being able to change state by mistake
    activities: []
  }

  componentDidMount() { //this will set the state with these values when the component is mounted
    axios.get<IActivity[]>('http://localhost:5000/api/activities') //define the return type after get
    .then((response) => {
      this.setState({
        activities: response.data //this transforms activities from an any type to a type of IActivity[] array.
      });
    });
  }
  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.activities.map((activity) => ( //we can now remove the any typing here
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
