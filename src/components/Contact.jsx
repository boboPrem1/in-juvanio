import DecryptedText from './DecryptedText';

const translations = {
  fr: {
    title1: "Travaillons",
    title2: "ensemble",
    sub: "Disponible pour missions freelance, CDI ou collaborations techniques",
    dlText: "Télécharger mon CV (PDF)"
  },
  en: {
    title1: "Let's work",
    title2: "together",
    sub: "Available for freelance missions, full-time roles, or technical collaborations",
    dlText: "Download my Resume (PDF)"
  }
};

export default function Contact({ language = 'fr' }) {
  const t = translations[language] || translations.fr;

  return (
    <section className="contact" id="contact">
      <div className="contact-bg"></div>
      <h2 className="contact-title"><DecryptedText text={t.title1} /><br /><span><DecryptedText text={t.title2} /></span></h2>
      <p className="contact-sub"><DecryptedText text={t.sub} duration={1200} /></p>

      <div className="contact-terminal">
        <div className="contact-terminal-header">
          <div className="contact-terminal-dot r"></div>
          <div className="contact-terminal-dot y"></div>
          <div className="contact-terminal-dot g"></div>
          <span className="contact-terminal-title">juvanio@secure-node ~ /contact</span>
        </div>
        <div className="contact-terminal-body">
          <a href="mailto:jamouzougan@gmail.com" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">mail</span>
            <span className="cmd-arg">jamouzougan@gmail.com</span>
          </a>
          <a href="tel:+22896858912" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">call</span>
            <span className="cmd-arg">+228 96 85 89 12</span>
          </a>
          <a href="https://www.linkedin.com/in/kangni-juvanio-amouzougan-709918189/" target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">open</span>
            <span className="cmd-arg">linkedin://kangni-juvanio-amouzougan-709918189</span>
          </a>
          <a href="https://pypi.org/project/tenxyte/" target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">pip install</span>
            <span className="cmd-arg">tenxyte</span>
          </a>
          <a href="https://github.com/boboprem1" target="_blank" rel="noreferrer" className="contact-cmd">
            <span className="cmd-prompt">❯</span>
            <span className="cmd-command">git clone</span>
            <span className="cmd-arg">github.com/boboprem1</span>
          </a>
        </div>
      </div>
      <div className="contact-cv-dl">
        <a href="G_Curriculum_Vitae.pdf" download className="btn btn-primary" style={{ display: 'inline-block' }}>
          <DecryptedText text={t.dlText} />
        </a>
      </div>
    </section>
  );
}
