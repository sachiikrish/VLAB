import React, { useState } from 'react';

export default function InteractiveUI() {
  const [chemA, setChemA] = useState('');
  const [chemB, setChemB] = useState('');
  const [temp, setTemp] = useState(25);
  const [log, setLog] = useState('Workspace clean. Select chemicals.');
  const [beakerColor, setBeakerColor] = useState('#44403c'); // High contrast default border color

  const handleSelection = (slot, name) => {
    if (slot === 'A') setChemA(name);
    else setChemB(name);
    setLog(`Configured ${name} inside reaction Slot ${slot}.`);
  };

  const handleTriggerReaction = () => {
    if (!chemA || !chemB) {
      setLog('System Error: Both chemical slots must be populated.');
      return;
    }
    setLog('Mixing sequence active. Processing molecular state...');
    
    setTimeout(() => {
      if (
        (chemA === 'Hydrochloric Acid' && chemB === 'Sodium Hydroxide') ||
        (chemB === 'Hydrochloric Acid' && chemA === 'Sodium Hydroxide')
      ) {
        setTemp(80);
        setBeakerColor('#22c55e'); // Vibrant high-visibility green
        setLog('Reaction Stabilized: Neutralization completed. Formed H2O + NaCl. Temperature reached 80°C.');
      } else if (
        (chemA === 'Copper Sulfate' && chemB === 'Sodium Hydroxide') ||
        (chemB === 'Copper Sulfate' && chemA === 'Sodium Hydroxide')
      ) {
        setTemp(32);
        setBeakerColor('#3b82f6'); // Vibrant high-visibility solid blue
        setLog('Reaction Stabilized: Copper Hydroxide thick blue precipitate settled. Temp stable at 32°C.');
      } else {
        setTemp(45);
        setBeakerColor('#eab308'); // High visibility bright yellow alert
        setLog('Reaction Complete: General mixture compound formed. Temperature registered at 45°C.');
      }
    }, 1200);
  };

  const handleReset = () => {
    setChemA('');
    setChemB('');
    setTemp(25);
    setBeakerColor('#44403c');
    setLog('Workspace clean. Select chemicals.');
  };

  const optionBtnStyle = (isSelected) => ({
    backgroundColor: isSelected ? '#FFFF00' : '#1c1917',
    color: isSelected ? '#000000' : '#FFFFFF',
    border: '3px solid #FFFF00',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    minHeight: '52px'
  });

  return (
    <div style={{ width: '100%', maxWidth: '500px', padding: '25px', backgroundColor: '#000000', borderRadius: '16px', border: '4px solid #FFFF00', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Simulation Workspace Panel Indicator Screen */}
      <div style={{ backgroundColor: '#1c1917', padding: '18px', borderRadius: '10px', marginBottom: '20px', border: '3px solid #FFFF00' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 'bold', fontSize: '16px' }}>
          <span style={{ color: '#00FF00' }}>HEAT METRIC: {temp}°C</span>
          <span style={{ color: '#FFFF00' }}>STATUS: ACTIVE</span>
        </div>

        {/* Dynamic Beaker Component Layer */}
        <div style={{ 
          height: '110px', backgroundColor: beakerColor, borderRadius: '12px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#000000',
          border: '3px solid #FFFFFF', marginBottom: '12px', textShadow: '0 0 2px #FFF'
        }}>
          {chemA && chemB ? `${chemA} + ${chemB}` : "[ EMPTY REACTION VESSEL ]"}
        </div>

        <div style={{ borderTop: '2px solid #444', paddingTop: '10px', color: '#FFFFFF', minHeight: '44px', fontSize: '14px', fontStyle: 'italic' }}>
          {log}
        </div>
      </div>

      {/* Control Grids Selection Formats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', color: '#FFFF00', marginBottom: '6px', fontSize: '15px' }}>Configure Chemical Component A:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button style={optionBtnStyle(chemA === 'Hydrochloric Acid')} onClick={() => handleSelection('A', 'Hydrochloric Acid')} aria-label="Load Hydrochloric Acid into Slot A">Hydrochloric Acid</button>
            <button style={optionBtnStyle(chemA === 'Copper Sulfate')} onClick={() => handleSelection('A', 'Copper Sulfate')} aria-label="Load Copper Sulfate into Slot A">Copper Sulfate</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', color: '#FFFF00', marginBottom: '6px', fontSize: '15px' }}>Configure Chemical Component B:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button style={optionBtnStyle(chemB === 'Sodium Hydroxide')} onClick={() => handleSelection('B', 'Sodium Hydroxide')} aria-label="Load Sodium Hydroxide into Slot B">Sodium Hydroxide</button>
            <button style={optionBtnStyle(chemB === 'Distilled Water')} onClick={() => handleSelection('B', 'Distilled Water')} aria-label="Load Distilled Water into Slot B">Distilled Water</button>
          </div>
        </div>

        {/* Execution Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '8px' }}>
          <button style={{ ...optionBtnStyle(false), backgroundColor: '#15803d', color: '#FFF', border: '3px solid #22c55e', fontSize: '18px' }} onClick={handleTriggerReaction} aria-label="Trigger chemical formulation mixture execution">
            Execute Reaction
          </button>
          <button style={{ ...optionBtnStyle(false), backgroundColor: '#7f1d1d', color: '#FFF', border: '3px solid #ef4444' }} onClick={handleReset} aria-label="Reset workspace layout variables">
            Reset Lab
          </button>
        </div>
      </div>
    </div>
  );
}
