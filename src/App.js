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
      minute: 0,
      animate: true,
    };
  }

  loadStation() {
    const position = this.state.position;

    this.setState({message: 'Loading station...'});

    vbb.nearby({latitude: position.coords.latitude, longitude: position.coords.longitude})
      .then(data => {
        if(!data[0]) {
          this.setState({station: null, loading: true, message: 'No station found in yor proximity'});
        } else {
          const isDifferent = this.state.station && this.state.station.id !== data[0].id ;
          this.setState({station: data[0], loading: isDifferent}, () => {
            this.loadBoard();
          });
        }
      })
  }

  loadData() {
    const checkPos = position => {
      if (this.state.position &&
          this.state.position.coords.latitude === position.coords.latitude &&
          this.state.position.coords.longitude === position.coords.longitude) return;

      this.setState({position}, () => {
        this.loadStation();
      });
    }

    const posERR = error => {
      this.setState({station: defaultStation, loading: true, message: 'Loading default station...'}, () => {
        this.loadBoard();
      });
    }

    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const long = searchParams.get('long');

    if (lat && long) {
      checkPos({coords: {latitude: lat, longitude: long}})
    } else if (navigator.geolocation) {
      this.setState({message: 'Loading location...'});
      navigator.geolocation.watchPosition(checkPos, posERR, {timeout: 15000});
    } else {
      posERR();
    }
  }

  loadBoard() {
    this.refreshInterval && clearInterval(this.refreshInterval);
    if (!this.state.station) return;

    this.setState({message: `Loading board for ${this.state.station.name}...`});

    vbb.departures(this.state.station.id, {duration: 180})
    .then(data => {
      this.setState({board: data, loading: !data, message: `No data for ${this.state.station.name}`});
      this.refreshInterval = setInterval(this.loadBoard.bind(this),30000);
      this.resetAnimation();
    })
  }

  setupTimeUpdate() {
    this.refreshTimeInterval = setInterval(() => {
      const currentMin = Math.floor(Date.now()/1000/60)
      if (this.state.minute !== currentMin){
        this.setState({ minute:  currentMin})
        this.resetAnimation();
      }
    }, 500);
  }

  resetAnimation() {
    this.resetAnimationTimeout && clearTimeout(this.resetAnimationTimeout)
    this.setState({ animate: false }, () => {
      this.resetAnimationTimeout = setTimeout(() => {
        this.setState({ animate: true });
      }, 1);
    });
  }

  componentDidMount() {
    this.loadData();
    this.setupTimeUpdate();
  }

  componentWillUnmount(){
    this.refreshInterval && clearInterval(this.refreshInterval);
    this.refreshTimeInterval && clearInterval(this.refreshTimeInterval);
    this.resetAnimationTimeout && clearTimeout(this.resetAnimationTimeout)
  }

  render() {
    const {loading, station, board, message, animate} = this.state;

    return (
      <div className='app'>
        {!loading && station &&
          <Board station={station} board={board} animate={animate}/>
        }
        {loading && message}
      </div>
    );
  }
}

