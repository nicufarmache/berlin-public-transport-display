import { useState, useEffect, useRef, useCallback } from 'react';
import Vbb from 'hafas-rest-api-client';
import Board from './Board';
import './App.css';

const apiEndpoint = 'https://v6-vbb.nicu.ro';

const vbb = Vbb(apiEndpoint, {
  userAgent: 'berlin-bus-display-dev',
});

const defaultStation = {
  id: '900014104',
  name: 'Audre-Lorde-Str. (Berlin) (Location Error)',
};

export default function App() {
  const [position, setPosition] = useState(null);
  const [station, setStation] = useState(null);
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading...');
  const [minute, setMinute] = useState(0);

  const positionRef = useRef(position);
  positionRef.current = position;

  const stationRef = useRef(station);
  stationRef.current = station;

  // Minute tick update for relative time recalculations aligned to minute boundaries
  useEffect(() => {
    let timerId;

    const scheduleNextMinuteTick = () => {
      const now = Date.now();
      setMinute(Math.floor(now / 60000));

      const msUntilNextMinute = 60000 - (now % 60000) + 50;
      timerId = setTimeout(scheduleNextMinuteTick, msUntilNextMinute);
    };

    scheduleNextMinuteTick();

    return () => clearTimeout(timerId);
  }, []);

  const loadBoardForStation = useCallback(async (currentStation) => {
    if (!currentStation) return;

    setMessage(`Loading board for ${currentStation.name}...`);

    try {
      const data = await vbb.departures(currentStation.id, {
        duration: 180,
        linesOfStops: false,
        remarks: false,
      });

      if (data?.departures) {
        setBoard(data.departures);
        setLoading(false);
      } else {
        setBoard(null);
        setLoading(true);
        setMessage(`No data for ${currentStation.name}`);
      }
    } catch {
      setMessage('Error loading board');
    }
  }, []);

  // Polling board every 30 seconds when station is set
  useEffect(() => {
    if (!station) return;

    loadBoardForStation(station);

    const interval = setInterval(() => {
      loadBoardForStation(station);
    }, 30000);

    return () => clearInterval(interval);
  }, [station, loadBoardForStation]);

  const loadStation = useCallback(async (pos) => {
    setMessage('Loading station...');

    try {
      const data = await vbb.nearby({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      if (!data || !data[0]) {
        setStation(null);
        setLoading(true);
        setMessage('No station found in your proximity');
      } else {
        const isDifferent = !stationRef.current || stationRef.current.id !== data[0].id;
        if (isDifferent) {
          setLoading(true);
        }
        setStation(data[0]);
      }
    } catch {
      setStation(defaultStation);
      setLoading(true);
      setMessage('Loading default station...');
    }
  }, []);

  // Initial location setup
  useEffect(() => {
    const posERR = () => {
      setStation(defaultStation);
      setLoading(true);
      setMessage('Loading default station...');
    };

    const checkPos = (newPos) => {
      const currentPos = positionRef.current;
      if (
        currentPos &&
        currentPos.coords.latitude === newPos.coords.latitude &&
        currentPos.coords.longitude === newPos.coords.longitude
      ) {
        return;
      }

      setPosition(newPos);
      loadStation(newPos);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const long = searchParams.get('long');

    let watchId = null;

    if (lat && long) {
      checkPos({ coords: { latitude: parseFloat(lat), longitude: parseFloat(long) } });
    } else if (navigator.geolocation) {
      setMessage('Loading location...');
      watchId = navigator.geolocation.watchPosition(checkPos, posERR, { timeout: 15000 });
    } else {
      posERR();
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [loadStation]);

  return (
    <div className="app">
      {!loading && station && (
        <Board station={station} board={board} minute={minute} />
      )}
      {loading && message}
    </div>
  );
}
