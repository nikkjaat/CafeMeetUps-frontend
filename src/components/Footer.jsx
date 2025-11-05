import { Heart, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Premium', href: '#' },
      { name: 'Mobile App', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Safety Tips', href: '#' },
      { name: 'Community Guidelines', href: '#' },
      { name: 'Report Issues', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Youtube, href: '#', name: 'YouTube' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Heart />
              </div>
              <span className={styles.logoText}>
                LoveConnect
              </span>
            </div>
            <p className={styles.brandDescription}>
              Connecting hearts worldwide. Join millions of people who have found love, 
              friendship, and meaningful relationships through our platform.
            </p>
            
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail />
                <span>hello@loveconnect.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.linksSection}>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className={styles.linksList}>
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className={styles.linksList}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className={styles.linksList}>
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className={styles.linksList}>
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={styles.newsletterSection}>
          <div className={styles.newsletterContent}>
            <h3 className={styles.newsletterTitle}>Stay Connected</h3>
            <p className={styles.newsletterDescription}>
              Get dating tips, success stories, and app updates delivered to your inbox.
            </p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
              />
              <button className={styles.subscribeBtn}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            {/* Copyright */}
            <div className={styles.copyright}>
              © 2024 LoveConnect. All rights reserved. Made with ❤️ for love seekers worldwide.
            </div>

            {/* Social Links */}
            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>Follow us:</span>
              <div className={styles.socialLinks}>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={styles.socialLink}
                    aria-label={social.name}
                  >
                    <IconComponent />
                  </a>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;