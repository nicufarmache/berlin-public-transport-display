import Line from './Line';
import './Board.css';

export default function Board({ station, board, minute }) {
  return (
    <div className="board" role="region" aria-label={`Abfahrten für ${station?.name || 'Station'}`}>
      {board && (
        <div className="list">
          <header className="header" aria-hidden="true">
            <div className="header__name">Linie</div>
            <div className="header__direction">Ziel</div>
            <div className="header__time">Abfahrt in</div>
          </header>
          <ul className="lines" aria-label="Abfahrtsliste">
            {board.slice(0, 200).map((entry, index) => (
              <Line entry={entry} key={entry.tripId || `${entry.line?.name}-${entry.when}-${index}`} minute={minute} />
            ))}
          </ul>
          <footer className="footer">{station?.name}</footer>
        </div>
      )}
    </div>
  );
}
