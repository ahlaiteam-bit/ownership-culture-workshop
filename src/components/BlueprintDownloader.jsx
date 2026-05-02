import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import html2pdf from 'html2pdf.js'
import { generateBlueprint, uploadBlueprintPdf } from '../utils/appsScriptApi'

export default function BlueprintDownloader({ state, saveBlueprint }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const pdfRef = useRef()

  const handleDownload = async () => {
    setLoading(true)
    setError(null)

    try {
      const blueprintResult = await generateBlueprint(state.userEmail)
      if (!blueprintResult.success || !blueprintResult.blueprint) {
        throw new Error(blueprintResult.error || "Failed to synthesize blueprint.")
      }
      
      saveBlueprint(blueprintResult.blueprint)

      setTimeout(() => {
        const element = pdfRef.current
        if (!element) {
          setError("PDF container not found.")
          setLoading(false)
          return
        }

        const filename = `Professional_Growth_Blueprint_${state.userProfile?.name?.replace(/\s+/g, '_') || 'Participant'}.pdf`;
        const opt = {
          margin: [10, 10, 15, 10], // top, left, bottom, right
          filename: filename,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        }

        const worker = html2pdf().set(opt).from(element);
        
        // Save locally and also upload to Google Drive
        worker.save().then(() => {
          worker.outputPdf('datauristring').then((base64Pdf) => {
            uploadBlueprintPdf(state.userEmail, base64Pdf, filename)
              .then(() => console.log('Successfully uploaded PDF to Drive'))
              .catch(e => console.error('Failed to upload PDF to Drive:', e))
              .finally(() => setLoading(false));
          });
        }).catch(err => {
          setError("PDF Error: " + err.message)
          setLoading(false)
        })
      }, 2000)

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const renderAllMarkdown = () => {
    if (!state.blueprint) return null;
    return (
      <div style={{ color: '#333' }}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 style={{ color: '#111827', fontSize: '20pt', fontWeight: 'bold', marginBottom: '15px', borderBottom: '2px solid #4CAF50', paddingBottom: '10px', marginTop: '30px', pageBreakBefore: 'auto', pageBreakAfter: 'avoid' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ color: '#111827', fontSize: '18pt', fontWeight: 'bold', marginTop: '25px', marginBottom: '10px', pageBreakAfter: 'avoid' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ color: '#059669', fontSize: '14pt', fontWeight: 'bold', marginTop: '24px', marginBottom: '10px', pageBreakAfter: 'avoid' }}>{children}</h3>,
            h4: ({ children }) => <h4 style={{ color: '#059669', fontSize: '12pt', fontWeight: 'bold', marginTop: '16px', marginBottom: '8px', pageBreakAfter: 'avoid' }}>{children}</h4>,
            p: ({ children }) => <p style={{ fontSize: '11.5pt', lineHeight: '1.6', marginBottom: '14px', color: '#374151' }}>{children}</p>,
            ul: ({ children }) => <ul style={{ marginBottom: '16px', paddingLeft: '24px', listStyleType: 'disc' }}>{children}</ul>,
            li: ({ children }) => <li style={{ marginBottom: '8px', fontSize: '11.5pt', color: '#374151', lineHeight: '1.5' }}>{children}</li>,
            strong: ({ children }) => <strong style={{ color: '#111827', fontWeight: '700' }}>{children}</strong>
          }}
        >
          {state.blueprint}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="card mt-6 text-center" style={{ backgroundColor: 'var(--color-primary-lighter)', borderColor: 'var(--color-primary)' }}>
      <h2 className="report-title" style={{ color: 'var(--color-primary)' }}>Workshop Completed!</h2>
      <p className="report-section__body mt-2 mb-4">
        Download your personalized Professional Growth Blueprint.
      </p>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
      
      <button className={`btn ${loading ? 'btn--outline' : 'btn--primary'}`} onClick={handleDownload} disabled={loading} style={{ padding: '16px 40px', fontSize: '1.1rem', minWidth: '300px' }}>
        {loading ? 'Synthesizing Blueprint...' : '⬇ Download My Blueprint'}
      </button>

      {/* OFF-SCREEN PRINT VIEW */}
      <div style={{ position: 'fixed', left: '-10000px', top: 0, width: '210mm', visibility: 'hidden' }}>
        <div ref={pdfRef} style={{ width: '210mm', background: '#fff' }}>
          
          {/* PAGE 1: COVER PAGE */}
          <div style={{ height: '260mm', padding: '15mm', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pageBreakAfter: 'always' }}>
            <h1 style={{ fontSize: '42pt', fontWeight: 'bold', color: '#111827', marginBottom: '30px', lineHeight: '1.1' }}>
              Professional <br/> Growth Blueprint
            </h1>
            <div style={{ width: '150px', height: '5px', background: '#059669', marginBottom: '60px', borderRadius: '3px' }} />
            
            <div style={{ width: '100%', maxWidth: '450px', textAlign: 'left', background: '#f9fafb', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13pt' }}>
                <tbody>
                  {[
                    ['Name:', state.userProfile?.name],
                    ['Email:', state.userProfile?.email],
                    ['Mobile:', state.userProfile?.mobile || '-'],
                    ['Company:', state.userProfile?.company],
                    ['Role:', state.userProfile?.role || '-'],
                    ['Department:', state.userProfile?.department || '-'],
                    ['Generated On:', new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) ]
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ padding: '12px 0', fontWeight: 'bold', width: '160px', color: '#1f2937', borderBottom: '1px solid #e5e7eb' }}>{label}</td>
                      <td style={{ padding: '12px 0', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '11pt', color: '#9ca3af', fontWeight: '500' }}>
              OWNERSHIP CULTURE WORKSHOP • CONFIDENTIAL & PERSONAL
            </div>
          </div>

          {/* PAGE 2+: CONTENT */}
          <div style={{ padding: '15mm', paddingTop: '5mm' }}>
            <h2 style={{ fontSize: '24pt', fontWeight: 'bold', marginBottom: '20px', color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              Your Synthesis
            </h2>
            <p style={{ fontSize: '12pt', lineHeight: '1.6', color: '#4b5563', marginBottom: '40px', fontStyle: 'italic' }}>
              This report brings together your reflections, insights, and action commitments from the Ownership Culture Workshop. 
              The sections below have been uniquely synthesized based on your answers across all modules.
            </p>
            {renderAllMarkdown()}
          </div>

        </div>
      </div>
    </div>
  )
}
