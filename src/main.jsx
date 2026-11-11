import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './tweaks.css';

function Icon({ name, size = 18, ...props }) {
  const paths = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.5 5.1-5.1 2.5 2.5-5.1 5.1-2.5Z"/></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
    crosshair: <><circle cx="12" cy="12" r="8"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function MapIllustration({ range }) {
  return <div className="map-canvas" role="img" aria-label="Illustrative suitability map centered on the entered reference point">
    <div className="map-grid" />
    <svg className="map-art" viewBox="0 0 900 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="water" d="M0 0h900v117c-58 12-87 4-130 29-54 31-86 18-135 25-55 8-80 40-146 39-52-1-82 22-121 42-45 23-80 13-130 45-55 35-93 42-147 41-43 0-69 29-91 57V0Z"/>
      <path className="land" d="M0 0h900v117c-58 12-87 4-130 29-54 31-86 18-135 25-55 8-80 40-146 39-52-1-82 22-121 42-45 23-80 13-130 45-55 35-93 42-147 41-43 0-69 29-91 57V0Z"/>
      <path className="green" d="M448 520c-31-54-23-105 6-150 24-37 52-47 94-53 42-6 52-32 87-42 24-7 49 10 77 2 25-7 40-31 75-28l113 17v254H448Z"/>
      <path className="green-light" d="M0 412c41-37 78-47 120-35 40 12 59 41 99 51 44 11 86-3 112 34l26 58H0Z"/>
      <path className="park" d="M610 241c21-30 55-42 89-39 32 3 61 23 65 49 6 36-27 59-60 64-33 4-80-6-98-34-8-13-5-27 4-40Z"/>
      <g className="roads">
        <path d="M-10 422c91-54 148-76 235-98s157-35 229-83 135-102 220-128 139-29 235-28"/>
        <path d="M71-20c54 86 80 140 112 210s65 122 132 164 127 74 175 177"/>
        <path d="M381-20c-14 100-1 165 23 234s73 114 131 154 116 87 146 170"/>
        <path d="M-20 207c79 25 147 30 212 16 75-16 120-49 188-56 86-9 148 30 232 23s167-53 308-84"/>
        <path d="M30 520c76-86 125-117 193-140 69-24 141-10 204-35 54-22 92-58 140-78 74-31 177-31 345-58"/>
        <path className="major" d="M-14 493c106-98 199-126 290-137 84-10 126-5 200-57 63-45 104-97 173-119 76-24 157-3 265-55"/>
        <path className="major" d="M179-20c27 99 50 181 101 239 42 47 111 62 151 117 37 50 46 102 101 184"/>
      </g>
      <g className="blocks">
        <rect x="244" y="118" width="61" height="36" rx="4"/><rect x="318" y="105" width="56" height="42" rx="4"/>
        <rect x="394" y="112" width="53" height="36" rx="4"/><rect x="118" y="179" width="68" height="35" rx="4"/>
        <rect x="216" y="222" width="51" height="42" rx="4"/><rect x="292" y="206" width="61" height="40" rx="4"/>
        <rect x="418" y="264" width="62" height="38" rx="4"/><rect x="492" y="298" width="51" height="32" rx="4"/>
        <rect x="151" y="316" width="63" height="37" rx="4"/><rect x="256" y="356" width="59" height="37" rx="4"/>
        <rect x="350" y="328" width="49" height="38" rx="4"/><rect x="735" y="296" width="65" height="39" rx="4"/>
      </g>
      <g className="map-labels"><text x="72" y="78">North Ridge</text><text x="568" y="106">East Bay</text><text x="690" y="433">Watershed Park</text><text x="97" y="472">South District</text></g>
    </svg>
    <div className="range-ring"><span className="range-label">{range} km radius</span></div>
    <div className="map-crosshair"><span className="crosshair-dot"/><span className="crosshair-pulse"/></div>
    <div className="map-scale"><span>0</span><i/><span>{range} km</span></div>
    <div className="map-credit">Illustrative map · not for navigation</div>
    <div className="map-zoom"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button></div>
  </div>;
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [range, setRange] = useState('10');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [runId, setRunId] = useState(1);
  const rangePickerRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWelcome(false), 1350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!rangeOpen) return undefined;
    function closeOnOutsideClick(event) {
      if (!rangePickerRef.current?.contains(event.target)) setRangeOpen(false);
    }
    window.addEventListener('pointerdown', closeOnOutsideClick);
    return () => window.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [rangeOpen]);

  async function analyze(event) {
    event.preventDefault();
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!latitude || !longitude || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Enter a valid latitude (−90 to 90) and longitude (−180 to 180).');
      return;
    }
    setError('');
    setAssessment(null);
    setStatus('processing');
    const startedAt = performance.now();
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng, radiusKm: Number(range) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'The server could not validate this assessment.');
      setAssessment(payload.assessment);
      const remainingDisplayTime = Math.max(0, 650 - (performance.now() - startedAt));
      if (remainingDisplayTime) await new Promise((resolve) => window.setTimeout(resolve, remainingDisplayTime));
      setStatus('complete');
    } catch (requestError) {
      setStatus('idle');
      setError(requestError.message || 'Could not reach the assessment server. Start the local development server and try again.');
    }
  }

  function reset() {
    setStatus('idle'); setLatitude(''); setLongitude(''); setError(''); setAssessment(null); setRunId((id) => id + 1);
  }

  return <div className={`app-shell${showWelcome ? ' is-welcoming' : ''}`}>
    {showWelcome && <div className="welcome-screen" aria-label="Welcome to Fieldnote" role="status">
      <div className="welcome-content">
        <div className="welcome-mark" aria-hidden="true"><span/><span/><span/><span/></div>
        <span className="welcome-name">Fieldnote</span>
      </div>
    </div>}
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Fieldnote Home"><span className="brand-mark"><span/><span/><span/><span/></span><span>fieldnote</span></a>
      <div className="topbar-right"><span className="workspace-label">Research workspace</span><span className="avatar">R</span></div>
    </header>
    <main id="top" className="main-layout">
      <section className="intro">
        <h1>A Clearer Picture<br className="desktop-break"/> Starts <em>Here.</em></h1>
        <p className="intro-copy">Explore the area around a reference point with an early, data-informed suitability assessment.</p>
      </section>

      <section className="workspace" aria-label="Site Screening Workspace">
        <aside className="control-panel">
          <div className="panel-heading"><div className="heading-icon"><Icon name="pin" size={19}/></div><div><h2>Set Your Reference Point</h2><p>Choose a location and assessment radius.</p></div></div>
          <form onSubmit={analyze}>
            <fieldset className="coordinate-fieldset">
              <legend>Target Coordinates</legend>
              <div className="coordinate-row">
                <label className="input-wrap"><span>Latitude</span><input inputMode="decimal" type="number" step="any" min="-90" max="90" placeholder="37.7749" value={latitude} onChange={(e) => setLatitude(e.target.value)} aria-label="Latitude" /></label>
                <label className="input-wrap"><span>Longitude</span><input inputMode="decimal" type="number" step="any" min="-180" max="180" placeholder="−122.4194" value={longitude} onChange={(e) => setLongitude(e.target.value)} aria-label="Longitude" /></label>
              </div>
              <div className="helper-line"><Icon name="crosshair" size={14}/> WGS84 decimal degrees</div>
            </fieldset>
            <div className="form-actions">
              <div className="range-field">
              <span className="field-label">Assessment range</span>
              <div
                className="range-picker"
                ref={rangePickerRef}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setRangeOpen(false);
                }}
              >
                <button
                  type="button"
                  className={`range-trigger${rangeOpen ? ' is-open' : ''}`}
                  aria-haspopup="listbox"
                  aria-expanded={rangeOpen}
                  aria-label={`Assessment range: ${range} kilometres`}
                  onClick={() => setRangeOpen((open) => !open)}
                >
                  <span>{range} km</span>
                  <Icon name="chevron" size={16}/>
                </button>
                {rangeOpen && (
                  <div className="range-menu" role="listbox" aria-label="Choose assessment range">
                    <div className="range-menu-heading">Radius <span>km</span></div>
                    <div className="range-options">
                      {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="option"
                          aria-selected={range === String(n)}
                          className={`range-option${range === String(n) ? ' selected' : ''}`}
                          onClick={() => {
                            setRange(String(n));
                            setRangeOpen(false);
                          }}
                        >
                          <span>{n}</span>
                          {range === String(n) && <Icon name="check" size={14}/>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
              {error && <p className="error-message" role="alert">{error}</p>}
              <button className="analyze-button" type="submit" disabled={status === 'processing'}>{status === 'processing' ? <><span className="button-spinner"/> Assessing area…</> : 'Assess this area'}</button>
            </div>
          </form>
          <div className="panel-divider"/>
          <div className="method-note"><Icon name="info" size={16}/><p><strong>Early-stage research tool</strong><br/>Screening insights are indicative and should be confirmed through on-site assessment.</p></div>
        </aside>

        <section className="map-panel" aria-live="polite">
          {status === 'idle' && <div className="empty-state"><div className="empty-visual"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="empty-pin"><Icon name="pin" size={23}/></span><span className="orbit-center"/></div><h2>Your Area, In Context.</h2><p>Enter a target coordinate to begin your preliminary site screening.</p><div className="map-legend"><span><i className="legend-green"/>Higher suitability</span><span><i className="legend-yellow"/>Moderate</span><span><i className="legend-gray"/>Review needed</span></div></div>}
          {status === 'processing' && <div className="processing-state"><div className="processing-map"><MapIllustration range={range}/><div className="processing-overlay"><div className="scan-ring"><span/></div></div></div><div className="processing-copy"><div className="processing-kicker"><span className="live-dot"/> Server check in progress</div><h2>Validating your inputs<span className="ellipsis">…</span></h2><p>Checking the coordinates and selected assessment radius.</p><div className="progress-track"><span/></div><div className="process-steps"><span className="step-done"><Icon name="check" size={14}/> Reference point set</span><span className="step-active"><i/> Validating on server</span><span><i/> Preparing preview</span></div></div></div>}
          {status === 'complete' && <div className="result-state" key={runId}><div className="result-topline"><div><div className="result-kicker"><span className="result-status-dot"/> Inputs validated</div><h2>Area Overview</h2><p className="coordinates-summary"><Icon name="pin" size={14}/>{Number(assessment?.referencePoint?.latitude ?? latitude).toFixed(4)}, {Number(assessment?.referencePoint?.longitude ?? longitude).toFixed(4)} <span>·</span> {assessment?.radiusKm ?? range} km radius</p></div><button className="reset-button" onClick={reset}>New assessment <Icon name="arrow" size={15}/></button></div><MapIllustration range={assessment?.radiusKm ?? range}/><div className="result-footer"><div className="legend-inline"><span><i className="legend-green"/>Higher</span><span><i className="legend-yellow"/>Moderate</span><span><i className="legend-gray"/>Review</span></div><div className="layers-label"><Icon name="layers" size={15}/> Illustrative layers</div></div><div className="result-note"><Icon name="info" size={15}/><span>{assessment?.notice || 'Illustrative demonstration only. No live GIS, remote sensing, or validated ML assessment is connected.'}</span></div></div>}
        </section>
      </section>

      <footer className="page-footer"><span><Icon name="compass" size={15}/> Built for thoughtful field research</span><span><Icon name="clock" size={14}/> Preliminary assessment · {new Date().getFullYear()}</span></footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
