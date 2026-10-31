import React from 'react';

export default function VirtualLab() {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '500px', 
      padding: '25px', 
      backgroundColor: '#111111', 
      borderRadius: '16px', 
      border: '4px dashed #FFFF00',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ color: '#FFFF00', fontSize: '20px', marginBottom: '10px' }}>
        🏫 Middle School Simulation Workspace
      </h3>
      <p style={{ color: '#cccccc', fontSize: '15px', lineHeight: '1.6' }}>
        This module links directly to the foundational class 6th to 8th science curriculum framework. 
      </p>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#1c1917',
        borderRadius: '8px',
        border: '2px solid #00FF00',
        color: '#00FF00',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        ✓ Base System Ready for School Level Evaluators
      </div>
    </div>
  );
}
