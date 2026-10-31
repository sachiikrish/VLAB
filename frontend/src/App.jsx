import React, { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('calc'); // calc or lab
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [calcMode, setCalcMode] = useState('DEG'); // DEG, RAD, EQN
  const [eqnSubMode, setEqnSubMode] = useState('QUAD');
  const [memory, setMemory] = useState(0);

  // Equation Solver Coefficients States
  const [coeffA, setCoeffA] = useState('');
  const [coeffB, setCoeffB] = useState('');
  const [coeffC, setCoeffC] = useState('');

  // Lab System Simulation States
  const [labModule, setLabModule] = useState('chem'); // chem, phys, elec
  const [chemA, setChemA] = useState('');
  const [chemB, setChemB] = useState('');
  const [tempGauge, setTempGauge] = useState(25);
  const [labLog, setLabLog] = useState('Workspace safe. Populate reagent materials to execute.');
  const [beakerColor, setBeakerColor] = useState('#111');
  const [vParam, setVParam] = useState(6);
  const [rParam, setRParam] = useState(12);
  const [bitA, setBitA] = useState(0);
  const [bitB, setBitB] = useState(0);
  const [logicGate, setGateType] = useState('AND');

  const handleKeyTap = (val) => {
    setInput((prev) => prev + val);
  };

  const handleClearAll = () => {
    setInput(''); setResult('0'); setCoeffA(''); setCoeffB(''); setCoeffC('');
  };

  const executeEngineMath = () => {
    if (calcMode === 'EQN') {
      const a = parseFloat(coeffA), b = parseFloat(coeffB), c = parseFloat(coeffC);
      if (isNaN(a) || isNaN(b) || isNaN(c)) { setResult('Invalid'); return; }
      if (a === 0) { setResult('a cannot be 0'); return; }
      let d = (b * b) - (4 * a * c);
      if (d < 0) setResult('Imaginary Roots');
      else setResult(`x1=${((-b+Math.sqrt(d))/(2*a)).toFixed(1)}, x2=${((-b-Math.sqrt(d))/(2*a)).toFixed(1)}`);
      return;
    }
    try {
      let formula = input.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E').replace(/sin\(/g, 'Math.sin(').replace(/\^/g, '**');
      let output = eval(formula);
      setResult(output.toString());
    } catch { setResult('Syntax Error'); }
  };

  const triggerReaction = () => {
    if (!chemA || !chemB) { setLabLog('Slots vacant. Select elements.'); return; }
    setLabLog('Mixing contents... Computing reaction matrices...');
    setTimeout(() => {
      if ((chemA === 'HCl' && chemB === 'NaOH') || (chemB === 'HCl' && chemA === 'NaOH')) {
        setTempGauge(78); setBeakerColor('#22c55e');
        setLabLog('Neutralization Complete: Formed NaCl Salt and Water solution. Heat metric: 78°C.');
      } else {
        setTempGauge(42); setBeakerColor('#eab308');
        setLabLog('Formulation Complete: Standard chemical compound compiled safely.');
      }
    }, 1000);
  };
  const tabBtnStyle = (active) => ({
    flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer',
    backgroundColor: active ? '#FFFF00' : 'transparent', color: active ? '#000000' : '#FFFFFF',
    border: '2px solid #FFFFFF', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
  });

  const padBtnStyle = {
    backgroundColor: '#000000', color: '#FFFFFF', border: '2px solid #a8a29e', padding: '16px 2px',
    fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', minHeight: '58px'
  };

  const neonBtnStyle = { ...padBtnStyle, color: '#FFFF00', border: '2px solid #FFFF00' };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      
      {/* Upper Premium Glowing Banner Title */}
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'black', color: '#FFFF00', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '25px' }}>
        ENGINEERING WORKSPACE
      </h2>

      {/* Main Feature Operational Navigation System */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '640px', margin: '0 auto 25px auto', gap: '10px' }}>
        <button onClick={() => setTab('calc')} style={tabBtnStyle(tab === 'calc')}>⌨ Scientific Calculator</button>
        <button onClick={() => setTab('lab')} style={tabStyle(tab === 'lab')}>🔬 Virtual Science Lab</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {tab === 'calc' ? (
          /* ================= INTERACTIVE CALCULATOR ENGINE ================= */
          <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#000000', padding: '10px' }}>
            <div style={{ border: '2px solid #FFFFFF', padding: '16px', borderRadius: '4px', position: 'relative', textAlign: 'right', marginBottom: '15px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '11px', color: '#a8a29e', fontWeight: 'bold' }}>M: --  •  EQN {calcMode === 'EQN' ? 'ON' : 'OFF'}</span>
              <div style={{ fontSize: '16px', color: '#FFFF00', minHeight: '22px', marginTop: '10px', wordBreak: 'break-all' }}>{input || ' '}</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFFFFF' }}>{result}</div>
            </div>

            <div style={{ border: '2px solid #FFFFFF', padding: '12px', textAlign: 'center', borderRadius: '4px', color: '#FFFF00', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase' }}>
              {calcMode === 'EQN' ? `EQN Solver Matrix Mode Active` : "EQN Mode OFF"}
            </div>

            {/* Keypad Grid Matrix Array */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('sin(')}>sin</button>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('cos(')}>cos</button>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('tan(')}>tan</button>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('log(')}>log</button>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('ln(')}>ln</button>

              <button style={{ ...padBtnStyle, backgroundColor: '#7f1d1d', border: '2px solid #ef4444' }} onClick={handleClearAll}>C</button>
              <button style={padBtnStyle} onClick={() => setInput((p) => p.slice(0, -1))}>⌫</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('(')}>(</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap(')')}>)</button>
              <button style={neonBtnStyle} onClick={() => handleKeyTap('sqrt(')}>√</button>

              <button style={padBtnStyle} onClick={() => handleKeyTap('7')}>7</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('8')}>8</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('9')}>9</button>
              <button style={neonBtnStyle} onClick={() => setMemory(parseFloat(result) || 0)}>MS</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('/')}>÷</button>

              <button style={padBtnStyle} onClick={() => handleKeyTap('4')}>4</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('5')}>5</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('6')}>6</button>
              <button style={neonBtnStyle} onClick={() => setInput((p) => p + memory)}>MR</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('*')}>×</button>

              <button style={padBtnStyle} onClick={() => handleKeyTap('1')}>1</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('2')}>2</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('3')}>3</button>
              <button style={neonBtnStyle} onClick={() => { setCalcMode(calcMode === 'EQN' ? 'DEG' : 'EQN'); handleClearAll(); }}>MODE</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('-')}>-</button>

              <button style={padBtnStyle} onClick={() => handleKeyTap('0')}>0</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('.')}>.</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('π')}>π</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('^')}>^</button>
              <button style={padBtnStyle} onClick={() => handleKeyTap('+')}>+</button>

              <button style={{ ...padBtnStyle, gridColumn: 'span 5', backgroundColor: '#15803d', border: '2px solid #22c55e', fontSize: '24px' }} onClick={executeEngineMath}>=</button>
            </div>
          </div>
        ) : (
          /* ================= INTERACTIVE MULTI-LAB SIMULATOR ================= */
          <div style={{ width: '100%', maxWidth: '500px', padding: '15px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', backgroundColor: '#111', padding: '6px', borderRadius: '4px' }}>
              <button style={{ flex: 1, padding: '8px', fontWeight: 'bold', color: labModule === 'chem' ? '#000' : '#fff', backgroundColor: labModule === 'chem' ? '#FFFF00' : '#222' }} onClick={() => setLabModule('chem')}>Chemistry</button>
              <button style={{ flex: 1, padding: '8px', fontWeight: 'bold', color: labModule === 'phys' ? '#000' : '#fff', backgroundColor: labModule === 'phys' ? '#FFFF00' : '#222' }} onClick={() => setLabModule('phys')}>Physics</button>
            </div>
            {labModule === 'chem' ? (
              <div>
                <div style={{ backgroundColor: '#111', padding: '15px', border: '2px solid #FFFF00', borderRadius: '4px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00FF00', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}><span>TEMP: {tempGauge}°C</span><span>SYS: ACTIVE</span></div>
                  <div style={{ height: '80px', backgroundColor: beakerColor, border: '2px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', textShadow: '0 0 2px #FFF' }}>{chemA && chemB ? `${chemA} + ${chemB}` : "Empty Vessel"}</div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', fontStyle: 'italic', minHeight: '34px' }}>{labLog}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <button style={{ padding: '10px', fontWeight: 'bold', backgroundColor: chemA === 'HCl' ? '#FFFF00' : '#222', color: chemA === 'HCl' ? '#000' : '#fff' }} onClick={() => setChemA('HCl')}>Load Acid (HCl)</button>
                  <button style={{ padding: '10px', fontWeight: 'bold', backgroundColor: chemB === 'NaOH' ? '#FFFF00' : '#222', color: chemB === 'NaOH' ? '#000' : '#fff' }} onClick={() => setChemB('NaOH')}>Load Base (NaOH)</button>
                </div>
                <button onClick={triggerReaction} style={{ width: '100%', padding: '12px', backgroundColor: '#15803d', fontWeight: 'bold', border: '2px solid #22c55e', color: '#fff', cursor: 'pointer' }}>Run Titration Reaction</button>
              </div>
            ) : (
              <div style={{ backgroundColor: '#111', padding: '15px', border: '2px solid #FFFF00', borderRadius: '4px' }}>
                <h4 style={{ color: '#00FF00', margin: '0 0 10px 0' }}>Ohm's Law: {(vParam / rParam).toFixed(2)} Amps Current</h4>
                <label style={{ display: 'block', margin: '10px 0 5px 0', color: '#FFFF00' }}>Voltage Tracker: {vParam}V</label>
                <input type="range" min="1" max="24" value={vParam} onChange={(e) => setVParam(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#FFFF00' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
