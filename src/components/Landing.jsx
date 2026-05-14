import styles from './Landing.module.css'

export default function Landing({ onStart }) {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.logo}>Clausly</span>
        <button className={styles.navCta} onClick={onStart}>Get started →</button>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.pill}>Free · No account · ~5 min</div>
          <h1 className={styles.headline}>
            Legal docs for your<br />
            <em>Dutch startup.</em><br />
            <span className={styles.headlineSub}>Actually explained.</span>
          </h1>
          <p className={styles.description}>
            Answer a few questions. Get your Terms & Conditions, Privacy Policy, Cookie Policy, and AI Act compliance — generated for Dutch law, with every clause explained in plain English.
          </p>
          <button className={styles.cta} onClick={onStart}>
            Generate my documents
            <span>→</span>
          </button>
          <div className={styles.social}>
            <span>Trusted by founders in Amsterdam, Rotterdam, Utrecht</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.docCard}>
            <div className={styles.docCardHeader}>
              <span className={styles.docCardIcon}>📄</span>
              <span className={styles.docCardTitle}>General Terms & Conditions</span>
              <span className={styles.docCardBadge}>✓ Dutch law</span>
            </div>
            <div className={styles.clausePreview}>
              <div className={styles.clauseRow}>
                <span className={styles.clauseN}>01</span>
                <div className={styles.clauseBody}>
                  <div className={styles.clauseTitle}>Applicability</div>
                  <div className={styles.clauseText}>These terms apply to all services you offer online. Under Dutch Civil Code Art. 6:231, they must be provided before purchase.</div>
                  <div className={styles.clauseToggle}>▼ See legal text</div>
                </div>
              </div>
              <div className={styles.clauseRow}>
                <span className={styles.clauseN}>02</span>
                <div className={styles.clauseBody}>
                  <div className={styles.clauseTitle}>Right of withdrawal</div>
                  <div className={styles.clauseText}>B2C customers have 14 days to cancel. Required by EU Consumer Rights Directive — protects you if challenged.</div>
                  <div className={styles.clauseToggle}>▼ See legal text</div>
                </div>
              </div>
              <div className={`${styles.clauseRow} ${styles.clauseRowAI}`}>
                <span className={styles.clauseN}>03</span>
                <div className={styles.clauseBody}>
                  <div className={styles.clauseTitleRow}>
                    <div className={styles.clauseTitle}>AI transparency</div>
                    <span className={styles.aiBadge}>🤖 AI Act</span>
                  </div>
                  <div className={styles.clauseText}>You must tell users they're interacting with AI. Required by Article 50 EU AI Act 2024.</div>
                  <div className={styles.clauseToggle}>▼ See legal text</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.floatCard1}>
            <span>🔒</span>
            <div>
              <div className={styles.floatTitle}>GDPR compliant</div>
              <div className={styles.floatSub}>Privacy policy included</div>
            </div>
          </div>

          <div className={styles.floatCard2}>
            <span>⚡</span>
            <div>
              <div className={styles.floatTitle}>Ready in minutes</div>
              <div className={styles.floatSub}>Not weeks</div>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.howItWorks}>
        <div className={styles.howInner}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepText}>
              <strong>Tell us about your business</strong>
              <span>~20 questions about what you do, who your customers are, and what data you collect</span>
            </div>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepText}>
              <strong>We generate your documents</strong>
              <span>AI drafts all 4 documents in seconds, tailored to your exact business and Dutch law</span>
            </div>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepText}>
              <strong>Understand every clause</strong>
              <span>Each clause has a plain English explanation so you know what you're publishing</span>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo} style={{fontSize: 16}}>Clausly</span>
        <p>Documents are generated for informational purposes. For complex structures, consult a Dutch lawyer.</p>
      </footer>
    </div>
  )
}
