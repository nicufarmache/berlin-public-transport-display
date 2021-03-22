import React, { Component } from 'react';
import './Line.css';

export default class Line extends Component {
  render() {
    const { entry, animate } = this.props;

    const dateDep = new Date(entry.when);
    const DateNow = new Date();
    const seconds = (dateDep.getTime() - DateNow.getTime()) / 1000;

    return (
      <div className={"line"}>
          <div className="line__name">{entry.line.name}</div>
          <div className={`line__direction ${(animate && seconds<0) ? 'blink' : ''}`}>{entry.direction}</div>
          <div className="line__time">
            {(seconds<0) &&
                <span></span>
            }
            {(seconds>=0) && (seconds<3600) &&
                <span>{Math.ceil(seconds/60)} min</span>
            }
            {(seconds>=3600) &&
                <span>{Math.ceil(seconds/60/60)} h</span>
            }
          </div>
      </div>
    );
  }
}

