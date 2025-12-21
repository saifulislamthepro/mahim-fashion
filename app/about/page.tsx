import "./about.css";

export default function AboutPage() {
  return (
    <div className="about-page">
        <div className="flex">
            
            {/* Hero Section */}
            <section className="hero-section flex-column">
                <h1>About Mahim Fashion</h1>
                <p>
                Ravaa Fashion is a premier clothing brand in Bangladesh, dedicated to bringing
                style, quality, and comfort to modern fashion enthusiasts.
                </p>
                <img src="/logo/Logo.png" alt="Ravaa Fashion" className="hero-img"/>
            </section>

            {/* Our Story */}
            <section className="story-section flex-row">
                <div className="story-text">
                <h2>Our Story</h2>
                <p>
                    Founded with a vision to blend tradition with contemporary fashion, Ravaa
                    Fashion has been crafting stylish and high-quality clothing for men and
                    women. Our collections celebrate creativity, comfort, and sustainability.
                </p>
                </div>
                <div className="story-img">
                <img src="/banners/Banner-03.jpg" alt="Our Story"/>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-section flex-column">
                <h2>Our Mission & Vision</h2>
                <div className="mission-cards">
                <div className="card">
                    <h3>Mission</h3>
                    <p>
                    To provide premium clothing that combines style, comfort, and quality
                    at affordable prices for fashion lovers in Bangladesh and beyond.
                    </p>
                </div>
                <div className="card">
                    <h3>Vision</h3>
                    <p>
                    To become a leading fashion brand that defines trends and inspires
                    creativity in every wardrobe.
                    </p>
                </div>
                </div>
            </section>

            {/* Team */}
            <section className="team-section">
                <h2>Meet Our Team</h2>
                <div className="team-grid">
                <div className="team-member">
                    <h4>Moniruzzaman</h4>
                    <p>MD & CEO</p>
                </div>
                <div className="team-member">
                    <h4>MD. SAIFUL</h4>
                    <p>IT Manager</p>
                </div>
                <div className="team-member">
                    <h4>H ISLAM</h4>
                    <p>Marketing Officer</p>
                </div>
                <div className="team-member">
                    <h4>S ISLAM</h4>
                    <p>Jr Executive</p>
                </div>
                <div className="team-member">
                    <h4>MD. R</h4>
                    <p>Jr Graphic Designer</p>
                </div>
                </div>
            </section>

            {/* Contact / Call-to-action */}
            <section className="contact-section flex-column">
                <h2>Get in Touch</h2>
                <p>Have questions or want to collaborate? Reach out to us anytime.</p>
                <a href="/contact" className="contact-btn">Contact Us</a>
            </section>
        </div>
    </div>
  )
}
