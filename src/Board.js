import React, { Component } from 'react';
import Line from './Line';
import Vbb from 'hafas-rest-api-client';
import './Board.css';

const vbb = Vbb('https://v5.vbb.transport.rest', {
	userAgent: 'berlin-bus-display-dev',
})
const stationId = '900000014104';

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      station: null,
      loading: true,
    };
  }

  loadData() {
    console.log('Selected stop:', this.props);
    vbb.departures(this.props.station.id, {duration: 180})
    .then(data => {
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
    const selectedStation = this.props.station;

    return (
      <div className='board'>
        {!loading && station &&
          <div className="list">
            <header className="header">
              <div className="header__name">Linie</div>
              <div className="header__direction">Ziel</div>
              <div className="header__time">Abfahrt in</div>
            </header>
            {station.slice(0,5).map((entry, index) =>
            <Line entry={entry} key={index}/>
            )}
            <footer className="footer">
            {selectedStation.name}
            </footer>
          </div>
        }
      </div>
    );
  }
}

