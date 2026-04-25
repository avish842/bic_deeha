import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import appConfig from "../config/app.config";

const socialIcons = {
  FACEBOOK: FiFacebook,
  TWITTER: FiTwitter,
  INSTAGRAM: FiInstagram,
  YOUTUBE: FiYoutube,
};

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold font-heading text-white">
                {appConfig.APP_NAME}
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              {appConfig.DESCRIPTION}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold font-heading text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {appConfig.NAVBAR_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold font-heading text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMail className="mt-0.5 text-primary-400 flex-shrink-0" size={16} />
                <a href={`mailto:${appConfig.CONTACT.EMAIL}`} className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {appConfig.CONTACT.EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="mt-0.5 text-primary-400 flex-shrink-0" size={16} />
                <a href={`tel:${appConfig.CONTACT.PHONE}`} className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                  {appConfig.CONTACT.PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-primary-400 flex-shrink-0" size={16} />
                <span className="text-dark-400 text-sm">{appConfig.CONTACT.ADDRESS}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold font-heading text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {Object.entries(appConfig.SOCIAL_LINKS).map(([key, url]) => {
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-dark-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} {appConfig.APP_NAME}. All rights reserved.
          </p>
          <p className="text-dark-600 text-xs">
            v{appConfig.VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
