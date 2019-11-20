import React, { Component } from 'react';
import Line from './Line';
import './App.css';

const api = {
  station: 'https://3.vbb.transport.rest/stops/900000014104/departures'
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: null,
      loading: true,
    };
  }

  loadData() {
    fetch(api.station)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data);
      this.setState((state) => {
        return {station: data, loading:false};
      });
    })
  }

  componentDidMount() {
    this.loadData();
    setInterval(this.loadData.bind(this),10000);
  }

  render() {
    const {loading, station} = this.state;

    return (
      <div className='app'>
        {!loading && station &&
          <div className="list">
            {station.map(entry =>
            <Line entry={entry} />
            )}
          </div>
        }
      </div>
    );
  }
}

