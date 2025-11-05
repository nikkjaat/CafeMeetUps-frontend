import { Heart, Users, Shield, Award, Target, Zap } from 'lucide-react';
import styles from '../styles/About.module.css';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Connections',
      description: 'We believe in fostering genuine relationships built on trust and compatibility.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety and privacy are our top priorities with advanced security measures.'
    },
    {
      icon: Users,
      title: 'Inclusive Community',
      description: 'We welcome everyone regardless of background, orientation, or relationship goals.'
    },
    {
      icon: Award,
      title: 'Quality Matches',
      description: 'Our advanced algorithm ensures you meet people who truly complement you.'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Active Users' },
    { number: '50K+', label: 'Success Stories' },
    { number: '190+', label: 'Countries' },
    { number: '4.9/5', label: 'App Rating' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former relationship counselor with 10+ years of experience helping people find love.'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Tech innovator passionate about using AI to create meaningful connections.'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Safety',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Cybersecurity expert dedicated to creating a safe dating environment for all.'
    }
  ];

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            About 
            <span className={styles.gradientText}>
              {' '}LoveConnect
            </span>
          </h2>
          <p className={styles.description}>
            We're on a mission to help people find meaningful connections and build lasting relationships 
            in the digital age.
          </p>
        </div>

        {/* Story Section */}
        <div className={styles.storySection}>
          <div>
            <h3>Our Story</h3>
            <div className={styles.storyText}>
              <p>
                LoveConnect was born from a simple belief: everyone deserves to find love. Founded in 2020 
                by a team of relationship experts and tech innovators, we set out to create a dating platform 
                that prioritizes authentic connections over superficial interactions.
              </p>
              <p>
                Unlike other dating apps that focus solely on appearance, we use advanced algorithms to match 
                people based on compatibility, shared interests, and relationship goals. Our platform has helped 
                millions of people find meaningful relationships, from casual dating to lifelong partnerships.
              </p>
              <p>
                Today, LoveConnect is trusted by over 10 million users worldwide, with new success stories 
                being written every day. We're proud to be the platform where real love stories begin.
              </p>
            </div>
          </div>
          <div className={styles.storyImageContainer}>
            <div className={styles.storyImageBg}>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500"
                alt="Team collaboration"
                className={styles.storyImage}
              />
            </div>
            <div className={styles.storyIcon}>
              <Target />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className={styles.valuesSection}>
          <h3 className={styles.valuesTitle}>Our Values</h3>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <IconComponent />
                  </div>
                  <h4 className={styles.valueTitle}>{value.title}</h4>
                  <p className={styles.valueDescription}>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className={styles.teamSection}>
          <h3 className={styles.teamTitle}>Meet Our Team</h3>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <div className={styles.memberImage}>
                  <img
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <h4 className={styles.memberName}>{member.name}</h4>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className={styles.missionSection}>
          <Zap className={styles.missionIcon} />
          <h3 className={styles.missionTitle}>Our Mission</h3>
          <p className={styles.missionText}>
            To create a world where everyone can find meaningful connections and lasting love, 
            regardless of who they are or where they come from. We believe that love is a fundamental 
            human right, and we're here to make it accessible to all.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;