import React, { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [calcMode, setCalcMode] = useState('DEG'); // DEG, RAD, EQN
  const [eqnSubMode, setEqnSubMode] = useState('QUAD'); // QUAD, CUBIC, LINEAR2
  const [memory, setMemory] = useState(0);
  const [notationText, setNotationText] = useState('Awaiting functional shorthand expression inputs...');

  // Equation Solver Coefficients States
  const [coeffA, setCoeffA] = useState('');
  const [coeffB, setCoeffB] = useState('');
  const [coeffC, setCoeffC] = useState('');
  const [coeffD, setCoeffD] = useState(''); 
  const [coeffE, setCoeffE] = useState(''); 
  const [coeffF, setCoeffF] = useState('');

  const handleKeyTap = (val) => {
    const updated = input + val;
    setInput(updated);
    let read = updated.replace(/sin\(/g, 'Sine of ').replace(/cos\(/g, 'Cosine of ').replace(/sqrt\(/g, 'Square root of ').replace(/\^/g, ' power ');
    setNotationText(`Reading tracking: "${read}"`);
  };

  const handleClearAll = () => {
    setInput(''); setResult('0'); setCoeffA(''); setCoeffB(''); setCoeffC(''); setCoeffD(''); setCoeffE(''); setCoeffF('');
    setNotationText('Awaiting functional shorthand expression inputs...');
  };

  const solveCubic = (a, b, c, d) => {
    if (a === 0) return "a cannot be 0";
    let f = ((3 * c / a) - ((b * b) / (a * a))) / 3;
    let g = ((2 * (b * b * b) / (a * a * a)) - (9 * b * c / (a * a)) + (27 * d / a)) / 27;
    let h = ((g * g) / 4) + ((f * f * f) / 27);

    if (h > 0) {
      let R = -(g / 2) + Math.sqrt(h); let S = Math.cbrt(R);
      let T = -(g / 2) - Math.sqrt(h); let U = Math.cbrt(T);
      let x1 = (S + U) - (b / (3 * a)); return `x1 = ${x1.toFixed(2)}`;
    } else if (f === 0 && g === 0 && h === 0) {
      let x1 = -Math.cbrt(d / a); return `x1,2,3 = ${x1.toFixed(2)}`;
    } else {
      let i = Math.sqrt(((g * g) / 4) - h); let j = Math.cbrt(i);
      let k = Math.acos(-(g / (2 * i))); let m = Math.cos(k / 3); let n = Math.sqrt(3) * Math.sin(k / 3);
      let p = -(b / (3 * a)); let x1 = 2 * j * m + p; let x2 = -j * (m + n) + p; let x3 = -j * (m - n) + p;
      return `x1=${x1.toFixed(1)}, x2=${x2.toFixed(1)}, x3=${x3.toFixed(1)}`;
    }
  };
  const executeEngineMath = () => {
    if (calcMode === 'EQN') {
      const a = parseFloat(coeffA), b = parseFloat(coeffB), c = parseFloat(coeffC), d = parseFloat(coeffD);
      if (eqnSubMode === 'QUAD') {
        let disc = (b * b) - (4 * a * c);
        if (disc < 0) setResult('Imaginary Roots');
        else setResult(`x1=${((-b+Math.sqrt(disc))/(2*a)).toFixed(2)}, x2=${((-b-Math.sqrt(disc))/(2*a)).toFixed(2)}`);
      } else if (eqnSubMode === 'CUBIC') {
        setResult(solveCubic(a, b, c, d));
      } else if (eqnSubMode === 'LINEAR2') {
        let det = (a * parseFloat(coeffE)) - (b * d);
        if (det === 0) setResult('No Sol');
        else setResult(`x=${((c * parseFloat(coeffE)) - (b * parseFloat(coeffF))) / det}, y=${((a * parseFloat(coeffF)) - (c * d)) / det}`);
      }
      return;
    }
    try {
      let formula = input.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E').replace(/sin\(/g, 'Math.sin(').replace(/\^/g, '**');
      setResult(eval(formula).toString());
    } catch { setResult('Error'); }
  };

  const padBtnStyle = {
    backgroundColor: '#111111', color: '#FFFFFF', border: '2px solid #a8a29e', padding: '14px 2px',
    fontSize: '17px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', minHeight: '56px'
  };
  const neonBtnStyle = { ...padBtnStyle, color: '#FFFF00', border: '2px solid #FFFF00' };
  const inputStyle = { backgroundColor: '#1c1917', color: '#00FF00', border: '2px solid #FFFF00', padding: '6px', fontSize: '15px', width: '45%', textAlign: 'right', fontWeight: 'bold', borderRadius: '4px' };
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#FFFFFF', fontFamily: 'Arial, sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Upper Premium Glowing Banner Title */}
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '900', color: '#FFFF00', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '25px' }}>
        ENGINEERING ACCESSIBLE CALCULATOR
      </h2>

      <div style={{ width: '100%', maxWidth: '460px', backgroundColor: '#000000', padding: '10px' }}>
        
        {/* Main Digital Display Screen Unit */}
        <div style={{ border: '3px solid #FFFF00', padding: '18px', borderRadius: '8px', position: 'relative', textAlign: 'right', marginBottom: '18px', backgroundColor: '#0d0d0d' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '12px', color: '#a8a29e', fontWeight: 'bold' }}>M: --  •  EQN {calcMode === 'EQN' ? 'ON' : 'OFF'}</span>
          <div style={{ fontSize: '18px', color: '#FFFF00', minHeight: '26px', marginTop: '12px', wordBreak: 'break-all', fontWeight: '500' }}>{input || ' '}</div>
          <div style={{ fontSize: '38px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '4px' }}>{result}</div>
        </div>

        {/* Dynamic Notation Assistant / Equation Sub-Tabs Panel */}
        <div style={{ border: '2px dashed #FFFF00', padding: '12px', borderRadius: '6px', backgroundColor: '#111111', color: '#00FF00', fontSize: '14px', fontStyle: 'italic', marginBottom: '18px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {calcMode === 'EQN' ? (
            <div style={{ display: 'flex', gap: '6px', width: '100%', justifyContent: 'center' }}>
              {['QUAD', 'CUBIC', 'LINEAR2'].map((m) => <button key={m} style={{ backgroundColor: eqnSubMode === m ? '#FFFF00' : '#222', color: eqnSubMode === m ? '#000' : '#FFF', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #FFF', cursor: 'pointer' }} onClick={() => setEqnSubMode(m)}>{m}</button>)}
            </div>
          ) : notationText}
        </div>

        {/* Conditional Equation Inputs Render Container */}
        {calcMode === 'EQN' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#0d0d0d', border: '2px solid #FFF', padding: '12px', borderRadius: '6px', marginBottom: '18px' }}>
            {eqnSubMode === 'QUAD' && (<><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontWeight: 'bold' }}>Coeff a:</label><input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={inputStyle} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00' }}>Coeff b:</label><input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={inputStyle} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00' }}>Coeff c:</label><input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={inputStyle} /></div></>)}
            {eqnSubMode === 'CUBIC' && (<><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontWeight: 'bold' }}>Coeff a:</label><input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={inputStyle} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontWeight: 'bold' }}>Coeff b:</label><input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={inputStyle} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontWeight: 'bold' }}>Coeff c:</label><input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={inputStyle} /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontWeight: 'bold' }}>Coeff d:</label><input type="number" value={coeffD} onChange={(e) => setCoeffD(e.target.value)} style={inputStyle} /></div></>)}
            {eqnSubMode === 'LINEAR2' && (<><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '13px' }}>Eq1 (a1,b1,c1):</label><div style={{ display: 'flex', gap: '4px', width: '60%' }}><input placeholder="a1" type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={{ ...inputStyle, width: '33%' }} /><input placeholder="b1" type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={{ ...inputStyle, width: '33%' }} /><input placeholder="c1" type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={{ ...inputStyle, width: '33%' }} /></div></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '13px' }}>Eq2 (a2,b2,c2):</label><div style={{ display: 'flex', gap: '4px', width: '60%' }}><input placeholder="a2" type="number" value={coeffD} onChange={(e) => setCoeffD(e.target.value)} style={{ ...inputStyle, width: '33%' }} /><input placeholder="b2" type="number" value={coeffE} onChange={(e) => setCoeffE(e.target.value)} style={{ ...inputStyle, width: '33%' }} /><input placeholder="c2" type="number" value={coeffF} onChange={(e) => setCoeffF(e.target.value)} style={{ ...inputStyle, width: '33%' }} /></div></div></>)}
          </div>
        )}

        {/* Operational Keypad Matrix Layout Block */}
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

          <button style={{ ...padBtnStyle, gridColumn: 'span 5', backgroundColor: '#15803d', border: '2px solid #22c55e', fontSize: '22px', marginTop: '5px' }} onClick={executeEngineMath}>=</button>
        </div>
      </div>
    </div>
  );
}
