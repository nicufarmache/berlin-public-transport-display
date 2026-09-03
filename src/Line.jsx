import './Line.css';

export default function Line({ entry }) {
  const departureTime = entry.when || entry.plannedWhen;
  const dateDep = departureTime ? new Date(departureTime) : null;
  const dateNow = new Date();
  const seconds = dateDep ? (dateDep.getTime() - dateNow.getTime()) / 1000 : null;

  const minutesRemaining = seconds !== null ? Math.ceil(seconds / 60) : null;
  const hoursRemaining = seconds !== null ? Math.ceil(seconds / 3600) : null;

  return (
    <li className="line" aria-label={`${entry.line?.name || 'Linie'} nach ${entry.direction || 'Unbekannt'}`}>
      <div className="line__name">{entry.line?.name}</div>
      <div className={`line__direction ${seconds !== null && seconds < 0 ? 'blink' : ''}`}>
        {entry.direction}
      </div>
      <div className="line__time">
        {seconds !== null && seconds < 0 && (
          <span aria-label="Abfahrt jetzt" title="Abfahrt jetzt"></span>
        )}
        {seconds !== null && seconds >= 0 && seconds < 3600 && (
          <span aria-label={`${minutesRemaining} Minuten`}>{minutesRemaining} min</span>
        )}
        {seconds !== null && seconds >= 3600 && (
          <span aria-label={`${hoursRemaining} Stunden`}>{hoursRemaining} h</span>
        )}
      </div>
    </li>
  );
}
