import { AnchorHTMLAttributes, createContext, FormEvent, MouseEvent, useContext, useEffect, useMemo, useState } from "react";
import logoSrc from "../assets/logo SMC.png";
import heroSrc from "../assets/smc-construction-hero.png";

type PageKey = "home" | "services" | "expertise" | "engagements" | "contact" | "not-found";

type Service = {
  title: string;
  description: string;
  items: string[];
  icon: "materials" | "civil" | "trade";
};

type Step = {
  number: string;
  text: string;
};

type Commitment = {
  title: string;
  text: string;
};

type Stat = {
  value: string;
  label: string;
};

type ProductCategory = {
  title: string;
  items: string[];
};

type ProjectType = {
  title: string;
  text: string;
};

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
};

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Expertise", href: "/expertise" },
  { label: "Engagements", href: "/engagements" },
  { label: "Contact", href: "/contact" },
];

const services: Service[] = [
  {
    title: "Vente de matériels de construction",
    description:
      "Fourniture d'équipements, matériaux et consommables pour le bâtiment, de la préparation du chantier à la finition.",
    items: ["Ciment, blocs, fer, agrégats", "Outillage et équipements de chantier", "Approvisionnement selon projet"],
    icon: "materials",
  },
  {
    title: "Travaux de génie civil",
    description:
      "Réalisation de travaux de construction et d'infrastructure avec une organisation adaptée aux contraintes du terrain.",
    items: ["Bâtiments et ouvrages courants", "Aménagements et infrastructures", "Suivi technique des travaux"],
    icon: "civil",
  },
  {
    title: "Import-export et services",
    description:
      "Commerce international et prestations diverses pour sécuriser l'accès aux produits, équipements et solutions utiles aux projets.",
    items: ["Recherche et sourcing produit", "Coordination logistique", "Services aux entreprises"],
    icon: "trade",
  },
];

const steps: Step[] = [
  { number: "01", text: "Évaluation du besoin et des contraintes du projet." },
  { number: "02", text: "Proposition technique ou commerciale adaptée." },
  { number: "03", text: "Approvisionnement, exécution ou coordination des services." },
];

const commitments: Commitment[] = [
  { title: "Disponibilité", text: "Réponse orientée terrain pour les besoins urgents en matériaux et services." },
  { title: "Fiabilité", text: "Sélection de fournitures et partenaires selon les exigences du chantier." },
  { title: "Suivi", text: "Coordination des demandes, des livraisons et des prestations jusqu'à l'achèvement." },
  { title: "Polyvalence", text: "Capacité à couvrir les besoins commerciaux, techniques et logistiques." },
];

const companyInfo = {
  name: "Société Mondial Construction",
  shortName: "SMC SARL",
  founded: "2020",
  address: "Ange Raphaël, Face Hôtel Le Select, Douala - Cameroun",
  phone: "+237 655 857 387",
  email: "societemondialconstruction@gmail.com",
  rccm: "RC/DLBB/2020/B/108",
  taxpayerNumber: "M012014402053Z",
  activity: "Vente de matériels de construction, génie civil, import-export, prestations de services",
};

const stats: Stat[] = [
  { value: "2020", label: "Année de création" },
  { value: "4", label: "Domaines d'activité" },
  { value: "Douala", label: "Base opérationnelle" },
  { value: "BTP", label: "Secteur principal" },
];

const productCategories: ProductCategory[] = [
  {
    title: "Gros oeuvre",
    items: ["Ciment", "Fer à béton", "Blocs", "Sable et gravier", "Tôles et bois de coffrage"],
  },
  {
    title: "Équipements de chantier",
    items: ["Outillage", "Équipements de protection", "Accessoires de coffrage", "Consommables"],
  },
  {
    title: "Second oeuvre",
    items: ["Plomberie", "Électricité", "Revêtements", "Peinture", "Quincaillerie"],
  },
  {
    title: "Sourcing import-export",
    items: ["Recherche fournisseur", "Commande spécifique", "Coordination logistique", "Suivi d'approvisionnement"],
  },
];

const projectTypes: ProjectType[] = [
  {
    title: "Maisons et bâtiments privés",
    text: "Accompagnement pour l'achat de matériaux, la préparation du chantier et les travaux courants.",
  },
  {
    title: "Projets d'entreprise",
    text: "Fourniture, coordination et prestations pour magasins, bureaux, dépôts et sites d'exploitation.",
  },
  {
    title: "Infrastructures et aménagements",
    text: "Appui aux travaux de génie civil, terrassement, plateformes, petits ouvrages et accès.",
  },
];

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const page = useMemo(() => getPage(path), [path]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [path]);

  const navigate = (href: string) => {
    const nextPath = normalizePath(href);
    if (nextPath !== path) {
      window.history.pushState(null, "", nextPath);
      setPath(nextPath);
    }
  };

  return (
    <>
      <NavigationContext.Provider value={navigate}>
        <Header page={page} />
        <main>
          {page === "home" && <HomePage />}
          {page === "services" && <ServicesPage />}
          {page === "expertise" && <ExpertisePage />}
          {page === "engagements" && <CommitmentsPage />}
          {page === "contact" && <ContactPage />}
          {page === "not-found" && <NotFoundPage />}
        </main>
        <Footer />
      </NavigationContext.Provider>
    </>
  );
}

const NavigationContext = createContext<(href: string) => void>(() => undefined);

function AppLink({ href, className, children, onNavigate, ...props }: AppLinkProps) {
  const navigate = useContext(NavigationContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    navigate(href);
    onNavigate?.();
  };

  return (
    <a className={className} href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

function Header({ page }: { page: PageKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const solidHeader = page !== "home" || isScrolled || isOpen;

  useEffect(() => {
    const syncHeader = () => setIsScrolled(window.scrollY > 16);

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    return () => window.removeEventListener("scroll", syncHeader);
  }, [page]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`site-header ${solidHeader ? "is-scrolled" : ""} ${isOpen ? "is-open" : ""}`}>
      <AppLink className="brand" href="/" aria-label="Accueil SMC SARL" onNavigate={closeMenu}>
        <span className="brand-mark">
          <img src={logoSrc} alt="" />
        </span>
        <span>
          <strong>Société Mondial Construction</strong>
          <small>SMC SARL</small>
        </span>
      </AppLink>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
        <span className="sr-only">Menu</span>
      </button>

      <nav className={`site-nav ${isOpen ? "is-open" : ""}`} id="site-nav">
        {navItems.map((item) => (
          <AppLink key={item.href} href={item.href} onNavigate={closeMenu}>
            {item.label}
          </AppLink>
        ))}
      </nav>

      <AppLink className="header-cta" href="/contact" onNavigate={closeMenu}>
        Demandez un devis
      </AppLink>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <img className="hero-image" src={heroSrc} alt="Matériaux de construction et chantier de génie civil" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Construire aujourd'hui, bâtir demain</p>
          <h1>Société Mondial Construction</h1>
          <p className="hero-copy">
            Fourniture de matériaux, travaux de génie civil, import-export et prestations de services pour les projets
            de bâtiment et d'infrastructure.
          </p>
          <div className="hero-actions">
            <AppLink className="btn btn-primary" href="/contact">
              Demandez un devis
            </AppLink>
            <a className="btn btn-secondary" href="tel:+237655857387">
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>

      <section className="intro section-band" aria-label="Présentation">
        <div className="container intro-grid">
          <div>
            <p className="section-kicker">SMC SARL</p>
            <h2>Un partenaire BTP pour acheter, construire et livrer.</h2>
          </div>
          <p>
            Basée à Douala, Société Mondial Construction intervient auprès des particuliers, entreprises et donneurs
            d'ordre qui recherchent une réponse fiable pour les matériaux de construction, les travaux de génie civil et
            les opérations commerciales liées au bâtiment. Fondée en 2020, SMC SARL est implantée à Ange Raphaël,
            face Hôtel Le Select.
          </p>
        </div>
      </section>

      <StatsStrip />

      <section className="services">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Domaines d'activité</p>
            <h2>Des services structurés autour du chantier.</h2>
          </div>
          <ServiceGrid limit={3} />
          <div className="section-actions">
            <AppLink className="btn btn-primary" href="/services">
              Explorer tous les services
            </AppLink>
            <AppLink className="btn btn-outline" href="/contact">
              Obtenir une offre
            </AppLink>
          </div>
        </div>
      </section>

      <section className="project-types section-band">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Types de projets</p>
            <h2>Une présence utile à chaque étape du BTP.</h2>
          </div>
          <ProjectTypeGrid />
        </div>
      </section>
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero kicker="Services" title="Matériaux, travaux et commerce pour les projets BTP." />
      <section className="services page-section">
        <div className="container">
          <ServiceGrid />
        </div>
      </section>
      <ProductCategories />
      <CtaBand />
    </>
  );
}

function ExpertisePage() {
  return (
    <>
      <PageHero kicker="Expertise" title="Une méthode claire du besoin jusqu'à la livraison." />
      <section className="expertise section-band page-section">
        <div className="container split">
          <div>
            <p className="section-kicker">Méthode</p>
            <h2>Organiser avant d'exécuter.</h2>
            <p>
              SMC SARL analyse les quantités, les délais et les conditions de chantier avant de proposer une solution.
              Cette méthode permet de limiter les ruptures d'approvisionnement, les erreurs de commande et les retards
              d'exécution.
            </p>
          </div>
          <div className="steps" aria-label="Étapes de collaboration">
            {steps.map((step) => (
              <div className="step" key={step.number}>
                <span>{step.number}</span>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="process-detail">
        <div className="container process-grid">
          <div className="process-card">
            <span>Analyse</span>
            <h3>Comprendre les quantités et les contraintes.</h3>
            <p>Lecture du besoin, estimation des volumes, priorité sur les produits critiques et délais réalistes.</p>
          </div>
          <div className="process-card">
            <span>Organisation</span>
            <h3>Préparer la solution avant le chantier.</h3>
            <p>Choix des fournitures, coordination des prestations et planification des livraisons utiles.</p>
          </div>
          <div className="process-card">
            <span>Suivi</span>
            <h3>Rester disponible pendant l'exécution.</h3>
            <p>Suivi des demandes, ajustements terrain et communication avec les équipes ou responsables projet.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function CommitmentsPage() {
  return (
    <>
      <PageHero kicker="Engagements" title="Les priorités qui encadrent chaque mission." />
      <section className="engagements page-section">
        <div className="container">
          <div className="commitment-grid">
            {commitments.map((commitment) => (
              <div className="commitment" key={commitment.title}>
                <strong>{commitment.title}</strong>
                <p>{commitment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="legal-band section-band">
        <div className="container legal-grid">
          <div>
            <p className="section-kicker">Identification</p>
            <h2>Une entreprise formalisée au Cameroun.</h2>
            <p>
              SMC SARL exerce sous la raison sociale Société Mondial Construction avec une immatriculation RCCM et un
              numéro contribuable communiqués pour les démarches administratives et commerciales.
            </p>
          </div>
          <div className="legal-list">
            <p><span>RCCM</span>{companyInfo.rccm}</p>
            <p><span>N° contribuable</span>{companyInfo.taxpayerNumber}</p>
            <p><span>Année de création</span>{companyInfo.founded}</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero kicker="Contact" title="Demandez votre devis ou contactez directement SMC SARL." />
      <QuickContact />
      <ContactSection />
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="page-hero not-found">
      <div className="container">
        <p className="section-kicker">Page introuvable</p>
        <h1>Cette page n'existe pas.</h1>
        <div className="section-actions">
          <AppLink className="btn btn-primary" href="/">
            Retour à l'accueil
          </AppLink>
        </div>
      </div>
    </section>
  );
}

function PageHero({ kicker, title }: { kicker: string; title: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="section-kicker">{kicker}</p>
        <h1>{title}</h1>
      </div>
    </section>
  );
}

function ServiceGrid({ limit }: { limit?: number }) {
  const visibleServices = typeof limit === "number" ? services.slice(0, limit) : services;

  return (
    <div className="service-grid">
      {visibleServices.map((service) => (
        <article className="service-card" key={service.title}>
          <ServiceIcon name={service.icon} />
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <ul>
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="Chiffres clés">
      <div className="container stats-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectTypeGrid() {
  return (
    <div className="project-grid">
      {projectTypes.map((project) => (
        <article className="project-card" key={project.title}>
          <h3>{project.title}</h3>
          <p>{project.text}</p>
        </article>
      ))}
    </div>
  );
}

function ProductCategories() {
  return (
    <section className="product-categories section-band">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Matériels et fournitures</p>
          <h2>Des familles de produits pour répondre aux besoins courants du chantier.</h2>
        </div>
        <div className="category-grid">
          {productCategories.map((category) => (
            <article className="category-card" key={category.title}>
              <h3>{category.title}</h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickContact() {
  return (
    <section className="quick-contact">
      <div className="container quick-grid">
        <AppLink className="quick-card quick-card-primary" href="/contact">
          <span>Devis</span>
          <strong>Demandez une offre personnalisée</strong>
        </AppLink>
        <a className="quick-card" href="tel:+237655857387">
          <span>Appel direct</span>
          <strong>{companyInfo.phone}</strong>
        </a>
        <a className="quick-card" href={`mailto:${companyInfo.email}`}>
          <span>E-mail</span>
          <strong>{companyInfo.email}</strong>
        </a>
        <div className="quick-card">
          <span>Adresse</span>
          <strong>{companyInfo.address}</strong>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("nom") ?? "");
    const contact = String(formData.get("contact") ?? "");
    const subject = String(formData.get("objet") ?? "Demande depuis le site web");
    const body = [
      `Nom: ${name}`,
      `Contact: ${contact}`,
      `Objet: ${subject}`,
      "",
      String(formData.get("message") ?? ""),
    ].join("\n");

    window.location.href = `mailto:${companyInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessage(`Votre messagerie va s'ouvrir. Vous pouvez aussi appeler SMC SARL au ${companyInfo.phone}.`);
  };

  return (
    <section className="contact section-band page-section">
      <div className="container contact-grid">
        <div>
          <p className="section-kicker">Coordonnées</p>
          <h2>Parlez-nous de votre besoin.</h2>
          <p>
            Envoyez une demande de prix, une liste de matériaux ou une description de travaux. Les coordonnées
            officielles de SMC SARL sont disponibles ci-dessous pour un contact direct.
          </p>
          <div className="contact-list">
            <p>
              <span>Adresse</span> {companyInfo.address}
            </p>
            <p>
              <span>Téléphone</span> <a href="tel:+237655857387">{companyInfo.phone}</a>
            </p>
            <p>
              <span>E-mail</span> <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
            </p>
            <p>
              <span>RCCM</span> {companyInfo.rccm}
            </p>
            <p>
              <span>N° contribuable</span> {companyInfo.taxpayerNumber}
            </p>
          </div>
        </div>

        <form className="contact-form" action={`mailto:${companyInfo.email}`} method="post" onSubmit={handleSubmit}>
          <label>
            Nom
            <input name="nom" type="text" autoComplete="name" required />
          </label>
          <label>
            Téléphone ou e-mail
            <input name="contact" type="text" autoComplete="email" required />
          </label>
          <label>
            Objet
            <select name="objet" required defaultValue="">
              <option value="">Sélectionner</option>
              <option>Matériaux de construction</option>
              <option>Travaux de génie civil</option>
              <option>Import-export / services</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required />
          </label>
          <button className="btn btn-primary" type="submit">
            Envoyer la demande de devis
          </button>
          <p className="form-note" aria-live="polite">
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-grid">
        <div>
          <p className="section-kicker">Demande de devis</p>
          <h2>Matériaux, travaux ou import-export : décrivez votre besoin à SMC SARL.</h2>
        </div>
        <div className="cta-actions">
          <AppLink className="btn btn-primary" href="/contact">
            Demandez un devis
          </AppLink>
          <a className="btn btn-primary" href="tel:+237655857387">
            Appeler SMC SARL
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <img src={logoSrc} alt="" />
          <div>
            <strong>{companyInfo.name}</strong>
            <p>
              {companyInfo.shortName}, entreprise camerounaise spécialisée dans la vente de matériels de construction,
              les travaux de génie civil, l'import-export et les prestations de services.
            </p>
          </div>
        </div>

        <div className="footer-details" aria-label="Informations légales et contact">
          <p>
            <span>Siège social</span>
            {companyInfo.address}
          </p>
          <p>
            <span>Téléphone</span>
            <a href="tel:+237655857387">{companyInfo.phone}</a>
          </p>
          <p>
            <span>E-mail</span>
            <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
          </p>
          <p>
            <span>RCCM</span>
            {companyInfo.rccm}
          </p>
          <p>
            <span>N° contribuable</span>
            {companyInfo.taxpayerNumber}
          </p>
          <p>
            <span>Création</span>
            {companyInfo.founded}
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {companyInfo.shortName}. Tous droits réservés.</p>
        <AppLink href="/">Retour à l'accueil</AppLink>
      </div>
      <div className="mobile-cta" aria-label="Actions rapides">
        <AppLink href="/contact">Demandez un devis</AppLink>
        <a href="tel:+237655857387">Appeler</a>
      </div>
    </footer>
  );
}

function ServiceIcon({ name }: { name: Service["icon"] }) {
  const paths = {
    materials: "M4 20h16M6 20V8l6-4 6 4v12M9 20v-8h6v8M8 8h8",
    civil: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M7 10h10",
    trade: "M4 7h16v10H4zM7 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M8 7V5h8v2M4 11h16",
  };

  return (
    <span className="service-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d={paths[name]} />
      </svg>
    </span>
  );
}

function normalizePath(path: string) {
  if (!path || path === "/index.html") {
    return "/";
  }

  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

function getPage(path: string): PageKey {
  switch (path) {
    case "/":
      return "home";
    case "/services":
      return "services";
    case "/expertise":
      return "expertise";
    case "/engagements":
      return "engagements";
    case "/contact":
      return "contact";
    default:
      return "not-found";
  }
}

export default App;
