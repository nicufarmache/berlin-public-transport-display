import React, { Component } from 'react';
import Line from './Line';
import Vbb from 'vbb-client';
import './App.css';

const vbb = Vbb({
  endpoint: "https://3.vbb.transport.rest"
});
const stationId = '900000014104';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: null,
      loading: true,
    };
  }

  loadData() {
    vbb.departures(stationId, {duration: 180})
    .then(data => {
      console.log(data);
      this.setState((state) => {
        return {station: data, loading:false};
      });
    })
  }

  componentDidMount() {
    this.loadData();
    setInterval(this.loadData.bind(this),30000);
  }

  render() {
    const {loading, station} = this.state;

    return (
      <div className='app'>
        {!loading && station &&
          <div className="list">
            {station.slice(0,5).map((entry, index) =>
            <Line entry={entry} key={index}/>
            )}
          </div>
        }
      </div>
    );
  }
}

