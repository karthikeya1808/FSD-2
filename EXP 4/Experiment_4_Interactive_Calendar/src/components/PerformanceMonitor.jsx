import React, { useEffect, useRef, useState } from 'react';
import { useOptimizationSettings } from '../context/OptimizationContext.jsx';
import { getProfilerStats, getRenderCounts, resetRenderStats } from '../utils/renderStats.js';

const TOGGLES = [
  {
    key: 'memoCards',
    label: 'React.memo on cards',
    help: 'EventCard skips re-rendering when its own props are unchanged.'
  },
  {
    key: 'useCallbackHandlers',
    label: 'useCallback on handlers',
    help: 'Click/drag handlers keep a stable reference instead of being recreated every render.'
  },
  {
    key: 'memoAgenda',
    label: 'useMemo for agenda',
    help: 'The "Upcoming Events" list is only recomputed when events or the search term change.'
  }
];

/**
 * "Heavier" analytics-style panel, intentionally code-split via React.lazy
 * in App.jsx to demonstrate lazy loading + Suspense.
 *
 * It combines three things the experiment's "Re-render Analysis" section
 * asks for:
 *  1. Three optimize/unoptimize toggles (backed by OptimizationContext) that
 *     actually flip real React.memo/useCallback/useMemo usage at runtime.
 *  2. Live render counts per component, read from the shared renderStats
 *     store that EventCard/CalendarDay/EventList/SearchBar report into.
 *  3. Real render-duration data captured via React's built-in <Profiler>
 *     API (wired up in App.jsx around the calendar and the agenda list),
 *     showing actual milliseconds spent rendering — not a simulated number.
 */
function PerformanceMonitor({ visibleEventCount, filteredEventCount, totalEventCount }) {
  const { settings, toggle } = useOptimizationSettings();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [liveStats, setLiveStats] = useState(() => ({
    counts: getRenderCounts(),
    profiler: getProfilerStats()
  }));

  useEffect(() => {
    setLastUpdate(new Date());
  }, [visibleEventCount, filteredEventCount, totalEventCount]);

  // Poll the shared render-stats store on an interval while this panel is
  // mounted, rather than subscribing with setState calls fired from inside
  // other components' render phases (which React warns against).
  useEffect(() => {
    const id = setInterval(() => {
      setLiveStats({ counts: getRenderCounts(), profiler: getProfilerStats() });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleReset = () => {
    resetRenderStats();
    setLiveStats({ counts: getRenderCounts(), profiler: getProfilerStats() });
  };

  const componentNames = Object.keys(liveStats.counts).sort();
  const profilerIds = Object.keys(liveStats.profiler).sort();

  return (
    <div className="performance-monitor">
      <h3>Performance Monitor</h3>
      <p className="performance-monitor__hint">
        Open React DevTools → Profiler to correlate these numbers with actual render timings.
      </p>

      <div className="perf-toggles">
        {TOGGLES.map(({ key, label, help }) => (
          <label key={key} className="perf-toggle" title={help}>
            <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />
            <span>
              {label}
              <em>{settings[key] ? 'Optimized' : 'Unoptimized'}</em>
            </span>
          </label>
        ))}
      </div>

      <dl className="performance-monitor__stats">
        <dt>App render count</dt>
        <dd>{renderCount.current}</dd>

        <dt>Total events loaded</dt>
        <dd>{totalEventCount}</dd>

        <dt>Filtered event count</dt>
        <dd>{filteredEventCount}</dd>

        <dt>Visible events (this month)</dt>
        <dd>{visibleEventCount}</dd>

        <dt>Last update</dt>
        <dd>{lastUpdate.toLocaleTimeString()}</dd>
      </dl>

      <div className="performance-monitor__section">
        <div className="performance-monitor__section-header">
          <h4>Render counts (live)</h4>
          <button type="button" className="btn btn--ghost btn--small" onClick={handleReset}>
            Reset
          </button>
        </div>
        {componentNames.length === 0 ? (
          <p className="performance-monitor__empty">No renders recorded yet.</p>
        ) : (
          <table className="performance-monitor__table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Renders</th>
              </tr>
            </thead>
            <tbody>
              {componentNames.map((name) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{liveStats.counts[name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="performance-monitor__section">
        <h4>Render duration (React Profiler)</h4>
        {profilerIds.length === 0 ? (
          <p className="performance-monitor__empty">Interact with the calendar to collect timing data.</p>
        ) : (
          <table className="performance-monitor__table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Commits</th>
                <th>Last (ms)</th>
                <th>Total (ms)</th>
              </tr>
            </thead>
            <tbody>
              {profilerIds.map((id) => {
                const stat = liveStats.profiler[id];
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{stat.commits}</td>
                    <td>{stat.lastDuration.toFixed(2)}</td>
                    <td>{stat.totalDuration.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PerformanceMonitor;
