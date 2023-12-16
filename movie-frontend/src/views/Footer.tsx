import Config from '../Config';

function Footer() {
  return (
    <div className="footer">
      <p>
        {new Date().getFullYear()} © {Config.SITE_NAME} ☄️
      </p>
    </div>
  );
}

export default Footer;
