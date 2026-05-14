import { useState } from 'react'
import styles from './Result.module.css'

export default function Result({ docs, answers, onRestart }) {
  const [activeDoc, setActiveDoc] = useState(docs?.documents?.[0]?.id || 'terms')
  const [expandedSections, setExpandedSections] = useState({})

  if (!docs) return null

  const { documents, alerts, summary } = docs
  const currentDoc = documents.find(d => d.id === activeDoc)

  function toggleSection(sectionId) {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  function downloadDoc(doc) {
    const html = generateHTML([doc], answers)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${answers.company_name || 'company'}-${doc.id}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadAll() {
    const html = generateHTML(documents, answers)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${answers.company_name || 'company'}-legal-documents.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const docIcons = { terms: '📄', privacy: '🔒', cookies: '🍪', ai_obligations: '🤖' }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.logo} onClick={onRestart}>Clausly</button>
        <div className={styles.headerRight}>
          <span className={styles.companyBadge}>{answers.company_name}</span>
          <button className={styles.downloadAll} onClick={downloadAll}>↓ Download all</button>
          <button className={styles.restartBtn} onClick={onRestart}>Start over</button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.sidebarLabel}>Your documents</div>
            {documents.map(doc => (
              <button
                key={doc.id}
                className={`${styles.docTab} ${activeDoc === doc.id ? styles.docTabActive : ''}`}
                onClick={() => setActiveDoc(doc.id)}
              >
                <span className={styles.docTabIcon}>{docIcons[doc.id] || '📋'}</span>
                <div className={styles.docTabText}>
                  <span className={styles.docTabTitle}>{doc.title}</span>
                  <span className={styles.docTabCount}>{doc.sections?.length || 0} clauses</span>
                </div>
                {activeDoc === doc.id && <span className={styles.docTabArrow}>→</span>}
              </button>
            ))}
          </div>

          {alerts && alerts.length > 0 && (
            <div className={styles.alertsBox}>
              <div className={styles.sidebarLabel}>Heads up</div>
              {alerts.map((alert, i) => (
                <div key={i} className={styles.alertItem}>
                  <span className={styles.alertDot} />
                  <span>{alert.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.main}>
          {currentDoc && (
            <>
              <div className={styles.docHeader}>
                <div className={styles.docHeaderLeft}>
                  <span className={styles.docIcon}>{docIcons[currentDoc.id] || '📋'}</span>
                  <div>
                    <h1 className={styles.docTitle}>{currentDoc.title}</h1>
                    <p className={styles.docSub}>{currentDoc.subtitle}</p>
                  </div>
                </div>
                <button className={styles.downloadBtn} onClick={() => downloadDoc(currentDoc)}>
                  ↓ Download
                </button>
              </div>

              <div className={styles.lawRow}>
                {currentDoc.applicable_law?.map(law => (
                  <span key={law} className={styles.lawChip}>{law}</span>
                ))}
              </div>

              <div className={styles.clauses}>
                {currentDoc.sections?.map((section, i) => (
                  <div key={section.id} className={`${styles.clause} ${section.flag === 'high-risk' ? styles.clauseRisk : section.flag === 'ai-act' ? styles.clauseAI : ''}`}>
                    <div className={styles.clauseMain}>
                      <div className={styles.clauseLeft}>
                        <span className={styles.clauseNum}>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div className={styles.clauseContent}>
                        <div className={styles.clauseTopRow}>
                          <span className={styles.clauseName}>{section.title}</span>
                          <div className={styles.clauseActions}>
                            {section.flag === 'high-risk' && <span className={styles.riskBadge}>⚠ Review carefully</span>}
                            {section.flag === 'ai-act' && <span className={styles.aiBadge}>🤖 AI Act</span>}
                            <span className={styles.validBadge}>✓ Dutch law</span>
                          </div>
                        </div>
                        <p className={styles.clauseWhy}>{section.why}</p>
                        <button
                          className={styles.legalToggle}
                          onClick={() => toggleSection(section.id)}
                        >
                          {expandedSections[section.id] ? '▲ Hide legal text' : '▼ See legal text'}
                        </button>
                        {expandedSections[section.id] && (
                          <div className={styles.legalText}>{section.legal_text}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function generateHTML(docs, answers) {
  const date = new Date().toLocaleDateString('en-NL')
  const company = answers.company_name || 'Company'
  const docIcons = { terms: '📄', privacy: '🔒', cookies: '🍪', ai_obligations: '🤖' }

  const docsHTML = docs.map(doc => {
    const sectionsHTML = doc.sections?.map((s, i) => `
      <div class="clause ${s.flag === 'high-risk' ? 'clause-risk' : s.flag === 'ai-act' ? 'clause-ai' : ''}">
        <div class="clause-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="clause-body">
          <div class="clause-top">
            <span class="clause-name">${s.title}</span>
            <div class="badges">
              ${s.flag === 'high-risk' ? '<span class="badge-risk">⚠ Review carefully</span>' : ''}
              ${s.flag === 'ai-act' ? '<span class="badge-ai">🤖 AI Act</span>' : ''}
              <span class="badge-valid">✓ Dutch law</span>
            </div>
          </div>
          <p class="clause-why">${s.why}</p>
          <div class="toggle" onclick="
            const lt = this.nextElementSibling;
            lt.classList.toggle('open');
            this.textContent = lt.classList.contains('open') ? '▲ Hide legal text' : '▼ See legal text';
          ">▼ See legal text</div>
          <div class="legal-text">${s.legal_text}</div>
        </div>
      </div>
    `).join('')

    return `
      <div class="doc">
        <div class="doc-header">
          <span class="doc-icon">${docIcons[doc.id] || '📋'}</span>
          <div>
            <h2>${doc.title}</h2>
            <p class="doc-sub">${doc.subtitle}</p>
          </div>
        </div>
        <div class="law-chips">
          ${doc.applicable_law?.map(l => `<span class="law-chip">${l}</span>`).join('') || ''}
        </div>
        <div class="clauses">${sectionsHTML}</div>
      </div>
    `
  }).join('<div class="sep"></div>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${company} — Legal Documents · Clausly</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
  background: #0D0D0D;
  color: #F0EDE8;
  line-height: 1.6;
  min-height: 100vh;
}

.cover {
  padding: 48px;
  border-bottom: 1px solid #1F1F1F;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cover-brand {
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  color: #888;
  letter-spacing: -0.3px;
}

.cover-company {
  font-family: 'DM Serif Display', serif;
  font-size: 42px;
  color: #F0EDE8;
  letter-spacing: -1px;
  margin-bottom: 6px;
}

.cover-meta {
  font-size: 13px;
  color: #555;
}

.cover-right {
  text-align: right;
  font-size: 12px;
  color: #444;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 56px 48px 100px;
}

.doc { margin-bottom: 64px; }

.doc-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.doc-icon { font-size: 28px; }

.doc-header h2 {
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  font-weight: 400;
  color: #F0EDE8;
  letter-spacing: -0.5px;
}

.doc-sub { font-size: 13px; color: #555; margin-top: 2px; }

.law-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 32px;
}

.law-chip {
  font-size: 10px;
  padding: 3px 10px;
  border: 1px solid #2A2A2A;
  border-radius: 20px;
  color: #666;
  letter-spacing: 0.02em;
}

.clauses { display: flex; flex-direction: column; gap: 2px; }

.clause {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 0;
  border: 1px solid #1A1A1A;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  transition: border-color 0.15s;
}

.clause:hover { border-color: #2A2A2A; }
.clause-risk { border-color: #3A1A0A; }
.clause-risk:hover { border-color: #6B2E0A; }
.clause-ai { border-color: #1A1A3A; }

.clause-num {
  background: #161616;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
  font-size: 11px;
  font-weight: 500;
  color: #444;
  letter-spacing: 0.05em;
  border-right: 1px solid #1A1A1A;
}

.clause-body { padding: 18px 20px; }

.clause-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.clause-name {
  font-size: 14px;
  font-weight: 500;
  color: #E8E4DE;
}

.badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; flex-shrink: 0; }

.badge-valid {
  font-size: 10px;
  padding: 2px 8px;
  background: #0A1F0A;
  border: 1px solid #1A3A1A;
  color: #4A8A42;
  border-radius: 20px;
  white-space: nowrap;
}

.badge-risk {
  font-size: 10px;
  padding: 2px 8px;
  background: #2A0A00;
  border: 1px solid #4A1A00;
  color: #C4520A;
  border-radius: 20px;
  white-space: nowrap;
}

.badge-ai {
  font-size: 10px;
  padding: 2px 8px;
  background: #0A0A2A;
  border: 1px solid #1A1A4A;
  color: #7070CC;
  border-radius: 20px;
  white-space: nowrap;
}

.clause-why {
  font-size: 14px;
  color: #AAA;
  line-height: 1.65;
  margin-bottom: 12px;
}

.toggle {
  font-size: 11px;
  color: #4A8A42;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.toggle:hover { color: #6AAA62; }

.legal-text {
  display: none;
  margin-top: 14px;
  padding: 14px 16px;
  background: #0A0A0A;
  border-radius: 6px;
  font-size: 12.5px;
  color: #666;
  line-height: 1.75;
  border-left: 2px solid #2A2A2A;
}

.legal-text.open { display: block; }

.sep {
  border: none;
  border-top: 1px solid #1A1A1A;
  margin: 64px 0;
}

.footer {
  text-align: center;
  font-size: 11px;
  color: #333;
  padding: 32px 48px;
  border-top: 1px solid #1A1A1A;
}

@media (max-width: 600px) {
  .cover { flex-direction: column; align-items: flex-start; gap: 20px; padding: 32px 24px; }
  .container { padding: 40px 20px 80px; }
  .clause { grid-template-columns: 36px 1fr; }
  .badges { display: none; }
}
</style>
</head>
<body>
<div class="cover">
  <div>
    <div class="cover-brand">Clausly</div>
    <div class="cover-company">${company}</div>
    <div class="cover-meta">Legal Documents Package · ${date}</div>
  </div>
  <div class="cover-right">Generated for Dutch law<br>clausly.com</div>
</div>
<div class="container">
  ${docsHTML}
</div>
<div class="footer">
  Generated by Clausly for informational purposes. For complex legal structures, consult a qualified Dutch lawyer.
</div>
</body>
</html>`
}
