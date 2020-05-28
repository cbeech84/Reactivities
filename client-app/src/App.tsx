import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() { //this will set the state with these values when the component is mounted
    axios.get('http://localhost:5000/api/values')
    .then((response) => {
      console.log(response);
      this.setState({
        values: response.data
      })
    })
    // this.setState({
    //   values: [{id: 1, name: 'Value 101'}, {id:2, name: 'Value 102'}]
    // })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ul>
            {this.state.values.map((value: any) => ( //mapping values using a callback function to the list below - we are turning off type safety by giving it the any type.
              <li key={value.id}>{value.name}</li> //important to always provide a key value, otherwise React gets annoyed with you
            ))}
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
