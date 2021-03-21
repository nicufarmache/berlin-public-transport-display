import React, { Component } from 'react';
import Vbb from 'hafas-rest-api-client';
import Board from './Board';
import './App.css';

const vbb = Vbb('https://v5.vbb.transport.rest', {
	userAgent: 'berlin-bus-display-dev',
})

const defaultStation = {
  id: '900000014104',
  name: 'Manteuffelstr./Köpenicker Str. (GPS Err)'
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: null,
      loading: true,
      message: 'Loading...',
    };
  }

  loadData() {
    const posOK = position => {
      this.setState(() => {
        return {message: 'Loading station...'};
      });
      vbb.nearby({latitude: position.coords.latitude, longitude: position.coords.longitude})
        .then(data => {
          console.log(data);
          this.setState((state) => {
            console.log(data);
            return {station: data[0], loading:false};
          });
        })
      navigator.geolocation.watchPosition(posOK, posERR);
    }

    const posERR = error => {
      this.setState(() => {
        return {station: defaultStation, loading:false, message: 'Loading default station...'};
      });
    }

    this.setState(() => {
      return {message: 'Loading location...'};
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(posOK, posERR, {timeout: 15000});
    } else {
      posERR()
    }
  }

  componentDidMount() {
    this.loadData();
    setInterval(this.loadData.bind(this),30000);
  }

  render() {
    const {loading, station, message} = this.state;

    return (
      <div className='app'>
        {!loading && station &&
          <Board station={station}/>
        }
        {loading && message}
      </div>
    );
  }
}

