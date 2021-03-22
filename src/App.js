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
      position: null,
      station: null,
      board: null,
      loading: true,
      message: 'Loading...',
    };
  }

  loadStation() {
    const position = this.state.position;

    this.setState(() => {
      return {message: 'Loading station...'};
    });

    vbb.nearby({latitude: position.coords.latitude, longitude: position.coords.longitude})
      .then(data => {
        if(!data[0]) {
          this.setState((state) => {
            return {station: null, loading: true, message: 'No station found in yor proximity'};
          });
        } else {
          const isDifferent = this.state.station && this.state.station.id !== data[0].id ;
          this.setState((state) => {
            return {station: data[0], loading: isDifferent};
          });
          this.loadBoard();
        }
      })
  }

  loadData() {
    const checkPos = position => {
      if (this.state.position &&
          this.state.position.coords.latitude === position.coords.latitude &&
          this.state.position.coords.longitude === position.coords.longitude) return;

      this.setState((state) => {
        return {position};
      });

      this.loadStation();
    }

    const posERR = error => {
      this.setState(() => {
        return {station: defaultStation, loading: true, message: 'Loading default station...'};
      });
      this.loadBoard();
    }

    if (navigator.geolocation) {
      this.setState(() => {
        return {message: 'Loading location...'};
      });
      navigator.geolocation.watchPosition(checkPos, posERR, {timeout: 15000});
    } else {
      posERR();
    }
  }

  loadBoard() {
    this.interval && clearInterval(this.interval);
    if (!this.state.station) return;

    this.setState(() => {
      return {message: `Loading board for ${this.state.station.name}...`};
    });

    vbb.departures(this.state.station.id, {duration: 180})
    .then(data => {
      this.setState((state) => {
        return {board: data, loading: !data, message: `No data for ${this.state.station.name}`};
      });
      this.interval = setInterval(this.loadBoard.bind(this),30000);
    })
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount(){
    this.interval && clearInterval(this.interval);
  }

  render() {
    const {loading, station, board, message} = this.state;

    return (
      <div className='app'>
        {!loading && station &&
          <Board station={station} board={board}/>
        }
        {loading && message}
      </div>
    );
  }
}

