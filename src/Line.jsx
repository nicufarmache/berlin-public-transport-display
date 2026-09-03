import './Line.css';

export default function Line({ entry }) {
  const dateDep = new Date(entry.when);
  const dateNow = new Date();
  const seconds = (dateDep.getTime() - dateNow.getTime()) / 1000;

  return (
    <div className="line">
      <div className="line__name">{entry.line?.name}</div>
      <div className={`line__direction ${seconds < 0 ? 'blink' : ''}`}>{entry.direction}</div>
      <div className="line__time">
        {seconds < 0 && <span></span>}
        {seconds >= 0 && seconds < 3600 && (
          <span>{Math.ceil(seconds / 60)} min</span>
        )}
        {seconds >= 3600 && (
          <span>{Math.ceil(seconds / 60 / 60)} h</span>
        )}
      </div>
    </div>
  );
}
