import React, { Component } from 'react';
import Vbb from 'hafas-rest-api-client';
import Board from './Board';
import './App.css';

const vbb = Vbb('https://v5.vbb.transport.rest', {
	userAgent: 'berlin-bus-display-dev',
})

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
    const posOK = position => {
      vbb.nearby({latitude: position.coords.latitude, longitude: position.coords.longitude})
        .then(data => {
          console.log(data);
          this.setState((state) => {
            console.log(data);
            return {station: data[0], loading:false};
          });
        })
    }

    const posERR = error => {
      this.setState(() => {
        return {station: {id: '900000014104', name: 'Manteuffelstr./Köpenicker Str. (GPS Err)'}, loading:false};
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(posOK, posERR);
    } else {
      posERR()
    }
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
          <Board station={station}/>
        }
        {loading && 'Loading...'}
      </div>
    );
  }
}

