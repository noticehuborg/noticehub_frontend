import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import LogoAndText from "/img/logoandtext.png";

const socialLinks = [
  { icon: "mdi:facebook", label: "Facebook", href: "#" },
  { icon: "mdi:instagram", label: "Instagram", href: "#" },
  { icon: "ri:twitter-x-fill", label: "X", href: "#" },
  { icon: "mdi:linkedin", label: "LinkedIn", href: "#" },
  { icon: "mdi:youtube", label: "YouTube", href: "#" },
];

const navCol1 = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const navCol2 = [
  { label: "Feed", to: "/feed" },
  { label: "Deadlines", to: "/deadlines" },
  { label: "Resources", to: "/resources" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cookies Settings", to: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-neutral-gray-1 -mt-8 md:-mt-12 rounded-t-4xl md:rounded-t-[48px] shadow-[0px_3px_2px_0px_rgba(0,0,0,0.17)] ring-1 ring-neutral-gray-3">
      <div className="section-container section-padding flex flex-col gap-11">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3.5">
              <img
                src={LogoAndText}
                alt="NoticeHub"
                className="h-14 md:h-20 w-auto object-left object-contain"
              />
              <p className="text-secondary text-base font-medium max-w-xs leading-6">
                Never miss a deadline again. Stay connected with your department.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  <Icon icon={s.icon} width={24} height={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav + Contact */}
          <div className="flex flex-wrap gap-16 md:gap-24">
            <div className="flex flex-col gap-5">
              {navCol1.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-secondary text-base font-semibold hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              {navCol2.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-secondary text-base font-semibold hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:map-marker" className="text-primary" width={20} />
                  <span className="text-secondary text-base font-semibold">Address</span>
                </div>
                <p className="text-neutral-gray-8 text-sm leading-5">Kumasi, KNUST, Ghana</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:phone" className="text-primary" width={20} />
                  <span className="text-secondary text-base font-semibold">Contact</span>
                </div>
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+233248196627"
                    className="text-neutral-gray-8 text-sm underline leading-5 hover:text-primary transition-colors"
                  >
                    +233 24 819 6627
                  </a>
                  <a
                    href="mailto:hello@noticehub.edu"
                    className="text-neutral-gray-8 text-sm underline leading-5 hover:text-primary transition-colors"
                  >
                    hello@noticehub.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="border-t border-neutral-gray-4" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3.5">
            <p className="text-secondary text-xs md:text-sm">
              © {new Date().getFullYear()} NoticeHub. All rights reserved.
            </p>
            <div className="flex justify-between md:justify-start items-center gap-6 w-full md:w-auto">
              {legalLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-secondary text-xs md:text-sm underline hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
