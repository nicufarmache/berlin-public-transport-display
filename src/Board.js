import React, { Component } from 'react';
import Line from './Line';
import './Board.css';
export default class Board extends Component {
  render() {
    const selectedStation = this.props.station;
    const {board, animate} = this.props;

    return (
      <div className='board'>
        {board &&
          <div className="list">
            <header className="header">
              <div className="header__name">Linie</div>
              <div className="header__direction">Ziel</div>
              <div className="header__time">Abfahrt in</div>
            </header>
            <div className="lines">
              {board.slice(0,200).map((entry, index) =>
              <Line entry={entry} key={index} animate={animate}/>
              )}
            </div>
            <footer className="footer">
            {selectedStation.name}
            </footer>
          </div>
        }
      </div>
    );
  }
}

