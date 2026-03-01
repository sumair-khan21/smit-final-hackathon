import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Stethoscope, Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "AI Diagnosis", href: "/#features" },
        { label: "Analytics", href: "/#features" },
      ],
    },
    {
      title: "Roles",
      links: [
        { label: "For Doctors", href: ROUTES.LOGIN },
        { label: "For Admins", href: ROUTES.LOGIN },
        { label: "For Receptionists", href: ROUTES.LOGIN },
        { label: "For Patients", href: ROUTES.LOGIN },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "About", href: ROUTES.ABOUT },
        { label: "Contact", href: ROUTES.CONTACT },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 w-fit">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-foreground">AI Clinic</span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Health Platform</span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Intelligent clinic management powered by AI. Streamline operations, improve patient care, and grow your practice.
            </p>

            <div className="space-y-2.5">
              <a href="mailto:hello@aiclinic.com" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                hello@aiclinic.com
              </a>
              <a href="tel:+923000000000" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                +92-300-000-0000
              </a>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                Karachi, Pakistan
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground tracking-wide">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-border/40" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            &copy; {currentYear} AI Clinic. Made with
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            for better healthcare.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <Link to={ROUTES.CONTACT} className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
