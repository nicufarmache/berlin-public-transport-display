import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import Board from './Board';
import Line from './Line';

describe('App component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading state initially', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

describe('Board and Line components', () => {
  it('renders board header and departure entries', () => {
    const mockStation = { id: '123', name: 'Berlin Alexanderplatz' };
    const mockBoard = [
      {
        tripId: '1',
        line: { name: 'U2' },
        direction: 'Pankow',
        when: new Date(Date.now() + 5 * 60000).toISOString(),
      },
      {
        tripId: '2',
        line: { name: 'M4' },
        direction: 'Falkenberg',
        when: new Date(Date.now() + 12 * 60000).toISOString(),
      },
    ];

    render(<Board station={mockStation} board={mockBoard} minute={0} />);

    expect(screen.getByText('Linie')).toBeInTheDocument();
    expect(screen.getByText('Ziel')).toBeInTheDocument();
    expect(screen.getByText('Abfahrt in')).toBeInTheDocument();
    expect(screen.getByText('Berlin Alexanderplatz')).toBeInTheDocument();
    expect(screen.getByText('U2')).toBeInTheDocument();
    expect(screen.getByText('Pankow')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('renders line with correct remaining minutes', () => {
    const entry = {
      line: { name: 'S7' },
      direction: 'Ahrensfelde',
      when: new Date(Date.now() + 8 * 60000).toISOString(),
    };

    render(<Line entry={entry} />);
    expect(screen.getByText('S7')).toBeInTheDocument();
    expect(screen.getByText('Ahrensfelde')).toBeInTheDocument();
    expect(screen.getByText('8 min')).toBeInTheDocument();
  });
});
