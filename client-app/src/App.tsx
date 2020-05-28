import React, {Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() { //this will set the state with these values when the component is mounted
    axios.get('http://localhost:5000/api/values')
    .then((response) => {
      this.setState({
        values: response.data
      })
    })
    // this.setState({ //we can use this when we just want to set static data - api solution is above
    //   values: [{id: 1, name: 'Value 101'}, {id:2, name: 'Value 102'}]
    // })
  }
  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map((value: any) => ( 
            <List.Item key={value.id}>{value.name}</List.Item>
          ))}
        </List>
          {/* <ul> //this entire list is replaced by the list semantic UI list above
            {this.state.values.map((value: any) => ( //mapping values using a callback function to the list below - we are turning off type safety by giving it the any type.
              <li key={value.id}>{value.name}</li> //important to always provide a key value, otherwise React gets annoyed with you
            ))}
          </ul> */}
      </div>
    );
  }
}

export default App;
