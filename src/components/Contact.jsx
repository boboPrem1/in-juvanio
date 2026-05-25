import DecryptedText from './DecryptedText';

export default function Contact({ language, data, skin }) {
  const t = data.contact[language] || data.contact.fr;
  const meta = data.meta;
  const anims = skin?.animations?.decryptedText || {};

  return (
    <section className="contact" id="contact">
      <div className="contact-bg"></div>
      <h2 className="contact-title"><DecryptedText text={t.title1} /><br /><span><DecryptedText text={t.title2} /></span></h2>
      <p className="contact-sub"><DecryptedText text={t.sub} duration={anims.contactSub || 1200} /></p>

      <div className="contact-terminal">
        <div className="contact-terminal-header">
          <div className="contact-terminal-dot r"></div>
          <div className="contact-terminal-dot y"></div>
          <div className="contact-terminal-dot g"></div>
          <span className="contact-terminal-title">
            {meta.terminalUser || meta.slug || 'portfolio'} ~ /contact
          </span>
        </div>
        <div className="contact-terminal-body">
          <a href={`mailto:${meta.contact.email}`} className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">mail</span>
            <span className="cmd-arg">{meta.contact.email}</span>
          </a>
          <a href={`tel:${meta.contact.phone.replace(/\s/g, '')}`} className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">call</span>
            <span className="cmd-arg">{meta.contact.phone}</span>
          </a>
          <a href={meta.contact.linkedin} target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">open</span>
            <span className="cmd-arg">linkedin://{meta.contact.linkedin_handle}</span>
          </a>
          <a href={meta.contact.pypi} target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">pip install</span>
            <span className="cmd-arg">{meta.contact.pypi_handle}</span>
          </a>
          <a href={meta.contact.github} target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">git clone</span>
            <span className="cmd-arg">github.com/{meta.contact.github_handle}</span>
          </a>
        </div>
      </div>
      <div className="contact-cv-dl">
        <a href={meta.contact.cv} download className="btn btn-primary" style={{display: 'inline-block'}}>
          <DecryptedText text={t.dlText} />
        </a>
      </div>
    </section>
  );
}
