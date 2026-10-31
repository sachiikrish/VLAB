import React, { useState } from 'react';

export default function ScientificCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [calcMode, setCalcMode] = useState('DEG'); // DEG, RAD, EQN
  const [eqnSubMode, setEqnSubMode] = useState('QUAD'); // QUAD, CUBIC, LINEAR2
  const [memory, setMemory] = useState(0);
  
  const [coeffA, setCoeffA] = useState('');
  const [coeffB, setCoeffB] = useState('');
  const [coeffC, setCoeffC] = useState('');
  const [coeffD, setCoeffD] = useState(''); 
  const [coeffE, setCoeffE] = useState(''); 
  const [coeffF, setCoeffF] = useState('');

  const handleBtnClick = (value) => {
    setInput((prev) => prev + value);
  };

  const toggleMode = () => {
    const modes = ['DEG', 'RAD', 'EQN'];
    const nextIndex = (modes.indexOf(calcMode) + 1) % modes.length;
    setCalcMode(modes[nextIndex]);
    handleClear();
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setCoeffA('');
    setCoeffB('');
    setCoeffC('');
    setCoeffD('');
    setCoeffE('');
    setCoeffF('');
  };

  const solveCubic = (a, b, c, d) => {
    if (a === 0) return "a cannot be 0";
    let f = ((3 * c / a) - ((b * b) / (a * a))) / 3;
    let g = ((2 * (b * b * b) / (a * a * a)) - (9 * b * c / (a * a)) + (27 * d / a)) / 27;
    let h = ((g * g) / 4) + ((f * f * f) / 27);

    if (h > 0) {
      let R = -(g / 2) + Math.sqrt(h);
      let S = Math.cbrt(R);
      let T = -(g / 2) - Math.sqrt(h);
      let U = Math.cbrt(T);
      let x1 = (S + U) - (b / (3 * a));
      return `x1 = ${x1.toFixed(2)} (Real)`;
    } else if (f === 0 && g === 0 && h === 0) {
      let x1 = -Math.cbrt(d / a);
      return `x1,2,3 = ${x1.toFixed(2)}`;
    } else {
      let i = Math.sqrt(((g * g) / 4) - h);
      let j = Math.cbrt(i);
      let k = Math.acos(-(g / (2 * i)));
      let m = Math.cos(k / 3);
      let n = Math.sqrt(3) * Math.sin(k / 3);
      let p = -(b / (3 * a));
      let x1 = 2 * j * m + p;
      let x2 = -j * (m + n) + p;
      let x3 = -j * (m - n) + p;
      return `x1=${x1.toFixed(2)}, x2=${x2.toFixed(2)}, x3=${x3.toFixed(2)}`;
    }
  };

  const solveLinear2 = (a1, b1, c1, a2, b2, c2) => {
    let determinant = (a1 * b2) - (b1 * a2);
    if (determinant === 0) return "No Unique Sol";
    let x = ((c1 * b2) - (b1 * c2)) / determinant;
    let y = ((a1 * c2) - (c1 * a2)) / determinant;
    return `x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`;
  };
  const handleEquationSolver = () => {
    const a = parseFloat(coeffA);
    const b = parseFloat(coeffB);
    const c = parseFloat(coeffC);
    const d = parseFloat(coeffD);
    const e = parseFloat(coeffE);
    const f = parseFloat(coeffF);

    if (eqnSubMode === 'QUAD') {
      if (isNaN(a) || isNaN(b) || isNaN(c)) return setResult('Invalid Inputs');
      if (a === 0) return setResult('a cannot be 0');
      let disc = (b * b) - (4 * a * c);
      if (disc < 0) setResult('Imaginary Roots');
      else {
        let r1 = (-b + Math.sqrt(disc)) / (2 * a);
        let r2 = (-b - Math.sqrt(disc)) / (2 * a);
        setResult(`x1 = ${r1.toFixed(2)}, x2 = ${r2.toFixed(2)}`);
      }
    } else if (eqnSubMode === 'CUBIC') {
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return setResult('Invalid Inputs');
      setResult(solveCubic(a, b, c, d));
    } else if (eqnSubMode === 'LINEAR2') {
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) return setResult('Invalid Inputs');
      setResult(solveLinear2(a, b, c, d, e, f));
    }
  };

  const calculateResult = () => {
    if (calcMode === 'EQN') {
      handleEquationSolver();
      return;
    }
    try {
      let expr = input
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, calcMode === 'DEG' ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
        .replace(/cos\(/g, calcMode === 'DEG' ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
        .replace(/tan\(/g, calcMode === 'DEG' ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**');

      let evalResult = eval(expr);
      if (isNaN(evalResult) || !isFinite(evalResult)) throw new Error();
      setResult(evalResult.toString());
    } catch (error) {
      setResult('Syntax Error');
    }
  };

  const actionStyle = {
    backgroundColor: '#1c1917', color: '#FFFF00', border: '3px solid #FFFF00',
    padding: '12px 6px', fontSize: '15px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', minHeight: '54px'
  };

  const numStyle = {
    backgroundColor: '#292524', color: '#FFFFFF', border: '2px solid #a8a29e',
    padding: '12px 6px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', minHeight: '54px'
  };

  const inputStyle = {
    backgroundColor: '#1c1917', color: '#00FF00', border: '2px solid #FFFF00',
    borderRadius: '4px', padding: '6px', fontSize: '15px', width: '45%', textAlign: 'right', fontWeight: 'bold'
  };

  const subTabStyle = (active) => ({
    backgroundColor: active ? '#FFFF00' : '#222', color: active ? '#000' : '#FFF',
    border: '1px solid #FFF', padding: '6px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer'
  });
  return (
    <div style={{ width: '100%', maxWidth: '460px', padding: '20px', backgroundColor: '#000000', borderRadius: '16px', border: '4px solid #FFFF00' }}>
      <div style={{ backgroundColor: '#1c1917', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '3px solid #FFFF00', textAlign: 'right' }}>
        <div style={{ fontSize: '13px', color: '#00FF00', float: 'left', fontWeight: 'bold' }}>MODE: {calcMode}</div>
        
        {calcMode === 'EQN' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '5px' }}>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-start', marginBottom: '5px' }}>
              <button style={subTabStyle(eqnSubMode === 'QUAD')} onClick={() => setEqnSubMode('QUAD')}>Quadratic</button>
              <button style={subTabStyle(eqnSubMode === 'CUBIC')} onClick={() => setEqnSubMode('CUBIC')}>Cubic</button>
              <button style={subTabStyle(eqnSubMode === 'LINEAR2')} onClick={() => setEqnSubMode('LINEAR2')}>Linear 2V</button>
            </div>

            {eqnSubMode === 'QUAD' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value a:</label><input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value b:</label><input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value c:</label><input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={inputStyle} /></div>
              </>
            )}

            {eqnSubMode === 'CUBIC' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value a:</label><input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value b:</label><input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value c:</label><input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '14px' }}>Value d:</label><input type="number" value={coeffD} onChange={(e) => setCoeffD(e.target.value)} style={inputStyle} /></div>
              </>
            )}

            {eqnSubMode === 'LINEAR2' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '12px' }}>Eq1 (a1,b1,c1):</label>
                  <div style={{ display: 'flex', gap: '3px', width: '60%' }}>
                    <input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                    <input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                    <input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><label style={{ color: '#FFFF00', fontSize: '12px' }}>Eq2 (a2,b2,c2):</label>
                  <div style={{ display: 'flex', gap: '3px', width: '60%' }}>
                    <input type="number" value={coeffD} onChange={(e) => setCoeffD(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                    <input type="number" value={coeffE} onChange={(e) => setCoeffE(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                    <input type="number" value={coeffF} onChange={(e) => setCoeffF(e.target.value)} style={{ ...inputStyle, width: '33%' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '18px', color: '#00FF00', minHeight: '28px', wordBreak: 'break-all' }}>{input || '0'}</div>
        )}
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFF00', marginTop: '6px' }}>{result || '0'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        <button style={{ ...actionStyle, backgroundColor: '#7f1d1d', color: '#FFF', border: '2px solid #ef4444' }} onClick={handleClear}>C</button>
        <button style={actionStyle} onClick={toggleMode}>MODE</button>
        <button style={actionStyle} onClick={() => setMemory(parseFloat(result) || 0)}>MS</button>
        <button style={actionStyle} onClick={() => setInput((p) => p + memory)}>MR</button>
        <button style={actionStyle} onClick={() => setInput((prev) => prev.slice(0, -1))}>⌫</button>

        <button style={actionStyle} onClick={() => handleBtnClick('sin(')}>sin</button>
        <button style={actionStyle} onClick={() => handleBtnClick('cos(')}>cos</button>
        <button style={actionStyle} onClick={() => handleBtnClick('tan(')}>tan</button>
        <button style={actionStyle} onClick={() => handleBtnClick('sqrt(')}>√</button>
        <button style={actionStyle} onClick={() => handleBtnClick('/')}>/</button>

        <button style={actionStyle} onClick={() => handleBtnClick('log(')}>log</button>
        <button style={actionStyle} onClick={() => handleBtnClick('ln(')}>ln</button>
        <button style={actionStyle} onClick={() => handleBtnClick('π')}>π</button>
        <button style={actionStyle} onClick={() => handleBtnClick('e')}>e</button>
        <button style={actionStyle} onClick={() => handleBtnClick('*')}>*</button>

        <button style={numStyle} onClick={() => handleBtnClick('7')}>7</button>
        <button style={numStyle} onClick={() => handleBtnClick('8')}>8</button>
        <button style={numStyle} onClick={() => handleBtnClick('9')}>9</button>
        <button style={actionStyle} onClick={() => handleBtnClick('(')}>(</button>
        <button style={actionStyle} onClick={() => handleBtnClick('-')}>-</button>

        <button style={numStyle} onClick={() => handleBtnClick('4')}>4</button>
        <button style={numStyle} onClick={() => handleBtnClick('5')}>5</button>
        <button style={numStyle} onClick={() => handleBtnClick('6')}>6</button>
        <button style={actionStyle} onClick={() => handleBtnClick(')')}>)</button>
        <button style={actionStyle} onClick={() => handleBtnClick('+')}>+</button>

        <button style={numStyle} onClick={() => handleBtnClick('1')}>1</button>
        <button style={numStyle} onClick={() => handleBtnClick('2')}>2</button>
        <button style={numStyle} onClick={() => handleBtnClick('3')}>3</button>
        <button style={numStyle} onClick={() => handleBtnClick('0')}>0</button>
        <button style={numStyle} onClick={() => handleBtnClick('.')}>.</button>

        <button style={{ ...actionStyle, backgroundColor: '#15803d', color: '#FFF', border: '2px solid #22c55e', gridColumn: 'span 5', fontSize: '20px' }} onClick={calculateResult}>=</button>
      </div>
    </div>
  );
}
