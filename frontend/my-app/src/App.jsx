import React, { useState } from 'react';
import ScientificCalculator from './components/ScientificCalculator';
import InteractiveUI from './components/InteractiveUI';

export default function App() {
  const [tab, setTab] = useState('calc');

  const tabStyle = (isActive) => ({
    backgroundColor: isActive ? '#FFFF00' : '#1c1917',
    color: isActive ? '#000000' : '#FFFFFF',
    border: isActive ? '3px solid #FFFFFF' : '3px solid #44403c',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  });

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        backgroundColor: '#111111',
        padding: '16px 32px',
        borderBottom: '4px solid #FFFF00',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#FFFF00', fontWeight: 'bold' }}>
          VI Accessible Engineering Workspace
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setTab('calc')} style={tabStyle(tab === 'calc')} aria-label="Switch to Calculator">
            📊 Scientific Calculator
          </button>
          <button onClick={() => setTab('lab')} style={tabStyle(tab === 'lab')} aria-label="Switch to Lab">
            🧪 Virtual Science Lab
          </button>
        </div>
      </header>

      <main style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {tab === 'calc' ? <ScientificCalculator /> : <InteractiveUI />}
        </div>
      </main>
    </div>
  );
}