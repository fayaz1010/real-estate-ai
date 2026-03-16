import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  Star,
  Users,
  Building,
  Clock,
  Award,
  Target,
  ArrowRight,
  User,
  Briefcase,
  Code,
  Cpu,
} from "lucide-react";

const stats = [
  { label: "Founded", value: "2024", icon: Building },
  { label: "Properties Managed", value: "2,500+", icon: Target },
  { label: "Customer Satisfaction", value: "98%", icon: Award },
  { label: "Hours Saved/Week", value: "15+", icon: Clock },
];

const values = [
  {
    title: "Innovation",
    description:
      "We take an AI-first approach to every challenge. By leveraging cutting-edge machine learning and automation, we build tools that stay ahead of the curve and deliver measurable results for property managers.",
    icon: Zap,
  },
  {
    title: "Trust",
    description:
      "Security and transparency are at the core of everything we do. Your data is protected with enterprise-grade encryption, and our processes are open and auditable so you always know how decisions are made.",
    icon: Shield,
  },
  {
    title: "Simplicity",
    description:
      "Complex problems deserve simple solutions. We obsess over intuitive design so that even the most powerful features feel effortless to use, reducing onboarding time and increasing adoption across teams.",
    icon: Star,
  },
  {
    title: "Community",
    description:
      "Built for property managers, by property managers. We actively listen to our users, incorporate feedback into every release, and foster a community where knowledge and best practices are shared freely.",
    icon: Users,
  },
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Chief Executive Officer",
    bio: "Former VP at a leading proptech firm with 15 years of experience scaling property management platforms across global markets.",
    icon: User,
  },
  {
    name: "David Chen",
    role: "Chief Technology Officer",
    bio: "Ex-Google engineer specializing in distributed systems and AI infrastructure. Passionate about building technology that simplifies real-world operations.",
    icon: Code,
  },
  {
    name: "Amara Osei",
    role: "Head of Product",
    bio: "Product leader with a decade of experience in SaaS and marketplace platforms. Driven by user research and data-informed design decisions.",
    icon: Briefcase,
  },
  {
    name: "James Rivera",
    role: "Head of AI",
    bio: "PhD in Machine Learning from MIT. Previously led AI research teams focused on predictive analytics and natural language processing for enterprise applications.",
    icon: Cpu,
  },
];

export const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white" role="main">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 bg-realestate-primary overflow-hidden"
        aria-labelledby="about-hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-realestate-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-realestate-secondary rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1
            id="about-hero-heading"
            className="text-display text-white font-space-grotesk mb-6"
          >
            About RealEstate AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-3xl mx-auto leading-relaxed">
            We are transforming property management with artificial intelligence.
            Our platform combines decades of real estate expertise with
            state-of-the-art AI to help landlords and property managers operate
            smarter, reduce costs, and deliver exceptional tenant experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="mission-heading"
      >
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Our Mission
            </span>
            <h2
              id="mission-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-6"
            >
              Empowering Property Managers with Intelligent Tools
            </h2>
            <p className="text-lg text-gray-600 font-inter leading-relaxed">
              Our mission is to empower landlords and property managers with
              intelligent tools that automate routine tasks, reduce vacancies,
              and maximize returns. We believe that technology should work for
              you — not the other way around. By handling the repetitive work,
              we free you to focus on what matters most: growing your portfolio
              and building lasting relationships with your tenants.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-20 bg-white"
        aria-labelledby="stats-heading"
      >
        <div className="section-container">
          <h2 id="stats-heading" className="sr-only">
            Key Statistics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="card-elevated text-center p-6 md:p-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-realestate-accent/10 rounded-xl mb-4">
                    <IconComponent
                      className="w-6 h-6 text-realestate-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-realestate-primary font-space-grotesk">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-gray-500 font-inter mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section
        className="py-20 bg-realestate-primary"
        aria-labelledby="values-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/20 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Core Values
            </span>
            <h2
              id="values-heading"
              className="text-heading text-white font-space-grotesk"
            >
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-realestate-accent/20 rounded-xl flex items-center justify-center">
                      <IconComponent
                        className="w-6 h-6 text-realestate-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-space-grotesk mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-300 font-inter leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className="py-20 bg-gray-50"
        aria-labelledby="team-heading"
      >
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              Our Team
            </span>
            <h2
              id="team-heading"
              className="text-heading text-realestate-primary font-space-grotesk mb-4"
            >
              Meet the People Behind the Platform
            </h2>
            <p className="text-gray-600 font-inter max-w-2xl mx-auto">
              A diverse team of engineers, product thinkers, and real estate
              professionals united by a shared vision of smarter property
              management.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member) => {
              const IconComponent = member.icon;
              return (
                <article
                  key={member.name}
                  className="card-elevated p-6 text-center group"
                >
                  <div className="w-20 h-20 bg-realestate-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-realestate-accent/10 transition-colors duration-300">
                    <IconComponent
                      className="w-10 h-10 text-realestate-secondary group-hover:text-realestate-accent transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-realestate-primary font-space-grotesk">
                    {member.name}
                  </h3>
                  <p className="text-sm text-realestate-accent font-inter font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 font-inter leading-relaxed">
                    {member.bio}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-white"
        aria-labelledby="cta-heading"
      >
        <div className="section-container">
          <div className="card-elevated bg-gradient-to-br from-realestate-primary to-realestate-secondary p-10 md:p-16 text-center rounded-3xl shadow-realestate-lg">
            <h2
              id="cta-heading"
              className="text-heading text-white font-space-grotesk mb-4"
            >
              Ready to Transform Your Property Management?
            </h2>
            <p className="text-gray-300 font-inter max-w-2xl mx-auto mb-8 text-lg">
              Whether you want to join our growing team or experience the
              platform firsthand, we would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn-accent inline-flex items-center gap-2 px-8 py-3 text-base font-semibold"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="btn-outline border-white text-white hover:bg-white hover:text-realestate-primary inline-flex items-center gap-2 px-8 py-3 text-base font-semibold"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
