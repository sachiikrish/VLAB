import React, { useState } from 'react';

export default function PhysicsLab() {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(10);

  const calculatedCurrent = (voltage / resistance).toFixed(2);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '460px', 
      padding: '20px', 
      backgroundColor: '#000000', 
      borderRadius: '16px', 
      border: '4px solid #FFFF00',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#111111', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '20px', 
        border: '3px solid #FFFF00', 
        textAlign: 'center' 
      }}>
        <h3 style={{ color: '#FFFF00', margin: '0 0 10px 0', fontSize: '16px' }}>
          OHM'S LAW INDICATOR (I = V / R)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div style={{ border: '2px solid #FFFFFF', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#00FF00', fontSize: '12px', fontWeight: 'bold' }}>VOLTMETER</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>{voltage} V</div>
          </div>
          <div style={{ border: '2px solid #FFFFFF', padding: '10px', borderRadius: '6px' }}>
            <div style={{ color: '#00FF00', fontSize: '12px', fontWeight: 'bold' }}>RESISTANCE</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>{resistance} Ω</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#222222', padding: '12px', borderRadius: '6px', border: '2px dashed #FFFF00' }}>
          <div style={{ color: '#FFFF00', fontSize: '13px', fontWeight: 'bold' }}>TOTAL CALCULATED CURRENT (I)</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#00FF00', marginTop: '5px' }}>
            {calculatedCurrent} A
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', color: '#FFFF00', fontWeight: 'bold', marginBottom: '8px' }}>
            <span>Adjust Voltage (V):</span><span>{voltage}V</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="24" 
            value={voltage} 
            onChange={(e) => setVoltage(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: '#FFFF00', height: '8px', cursor: 'pointer' }} 
          />
        </div>
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', color: '#FFFF00', fontWeight: 'bold', marginBottom: '8px' }}>
            <span>Adjust Resistance (R):</span><span>{resistance}Ω</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={resistance} 
            onChange={(e) => setResistance(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: '#FFFF00', height: '8px', cursor: 'pointer' }} 
          />
        </div>
      </div>
    </div>
  );
}
