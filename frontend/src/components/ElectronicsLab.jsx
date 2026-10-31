import React, { useState } from 'react';

export default function ElectronicsLab() {
  const [gate, setGate] = useState('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const getLogicOutput = () => {
    if (gate === 'AND') return inputA && inputB;
    if (gate === 'OR') return inputA || inputB;
    if (gate === 'NOT') return inputA === 0 ? 1 : 0;
    if (gate === 'NAND') return !(inputA && inputB) ? 1 : 0;
    if (gate === 'NOR') return !(inputA || inputB) ? 1 : 0;
    return 0;
  };

  const btnStyle = (isActive) => ({
    backgroundColor: isActive ? '#FFFF00' : '#1c1917',
    color: isActive ? '#000000' : '#FFFFFF',
    border: '2px solid #FFFFFF',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    minHeight: '50px'
  });

  return (
    <div style={{ width: '100%', maxWidth: '460px', padding: '20px', backgroundColor: '#000000', borderRadius: '16px', border: '4px solid #FFFF00' }}>
      <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '3px solid #FFFF00', textAlign: 'center' }}>
        <h3 style={{ color: '#FFFF00', margin: '0 0 15px 0', fontSize: '16px' }}>{gate} GATE EXPERIMENT WORKSPACE</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', fontSize: '18px', fontWeight: 'bold' }}>
          <div style={{ border: '2px solid #FFF', padding: '8px 12px', borderRadius: '6px', color: '#00FF00' }}>Input A: {inputA}</div>
          <div style={{ color: '#FFFF00' }}>➔</div>
          <div style={{ border: '2px solid #FFF', padding: '8px 12px', borderRadius: '6px', color: '#00FF00' }}>Input B: {inputB}</div>
          <div style={{ color: '#FFFF00' }}>➔</div>
          <div style={{ backgroundColor: getLogicOutput() === 1 ? '#15803d' : '#7f1d1d', border: '3px solid #FFF', padding: '8px 15px', borderRadius: '6px', color: '#FFFF00', fontSize: '20px' }}>
            OUT: {getLogicOutput()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button style={btnStyle(inputA === 1)} onClick={() => setInputA(inputA === 0 ? 1 : 0)}>Toggle Input A</button>
          <button style={btnStyle(inputB === 1)} onClick={() => setInputB(inputB === 0 ? 1 : 0)}>Toggle Input B</button>
        </div>
        <div>
          <label style={{ color: '#FFFF00', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Select Core Logic Gate Engine:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {['AND', 'OR', 'NOT', 'NAND', 'NOR'].map((g) => (
              <button key={g} style={btnStyle(gate === g)} onClick={() => setGate(g)}>{g}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
