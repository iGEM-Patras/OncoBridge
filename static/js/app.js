const { useState, useEffect } = React;

// --- i18n Dictionary ---
const translations = {
  en: {
    appTitle: "OncoBridge",
    signIn: "Sign In",
    tabDoctors: "Find Doctors",
    tabSocial: "Social Feed",
    docTitle: "Find a Trusted Doctor",
    docSubtitle: "Connect with highly-rated oncology specialists in your area who understand your journey.",
    specialtyFilter: "Specialty",
    allSpecialties: "All Specialties",
    locationFilter: "Location",
    locationPlaceholder: "e.g. New York, NY",
    loadingDoctors: "Loading doctors...",
    noDoctors: "No doctors found",
    noDoctorsDesc: "Try adjusting your search filters to find more results.",
    viewProfile: "View Profile",
    feedTitle: "Community Stories",
    feedSubtitle: "Share your journey, ask questions, and find support from others who understand.",
    createPostBtn: "Share Your Story",
    postPlaceholder: "What's on your mind?",
    postAuthor: "Your Name (optional)",
    submitPost: "Post",
    loadingPosts: "Loading posts...",
    noPosts: "No posts yet. Be the first to share your story!",
    likes: "Likes",
    toggleContrast: "Toggle High Contrast"
  },
  el: {
    appTitle: "OncoBridge",
    signIn: "Σύνδεση",
    tabDoctors: "Εύρεση Γιατρών",
    tabSocial: "Κοινότητα",
    docTitle: "Βρείτε έναν Έμπιστο Γιατρό",
    docSubtitle: "Συνδεθείτε με κορυφαίους ογκολόγους στην περιοχή σας που κατανοούν την πορεία σας.",
    specialtyFilter: "Ειδικότητα",
    allSpecialties: "Όλες οι Ειδικότητες",
    locationFilter: "Τοποθεσία",
    locationPlaceholder: "π.χ. Αθήνα",
    loadingDoctors: "Φόρτωση γιατρών...",
    noDoctors: "Δεν βρέθηκαν γιατροί",
    noDoctorsDesc: "Δοκιμάστε να προσαρμόσετε τα φίλτρα αναζήτησης για περισσότερα αποτελέσματα.",
    viewProfile: "Προβολή Προφίλ",
    feedTitle: "Ιστορίες Κοινότητας",
    feedSubtitle: "Μοιραστείτε την πορεία σας, κάντε ερωτήσεις και βρείτε υποστήριξη από άλλους που κατανοούν.",
    createPostBtn: "Μοιραστείτε την Ιστορία Σας",
    postPlaceholder: "Τι σκέφτεστε;",
    postAuthor: "Το Όνομά Σας (προαιρετικό)",
    submitPost: "Δημοσίευση",
    loadingPosts: "Φόρτωση ιστοριών...",
    noPosts: "Δεν υπάρχουν δημοσιεύσεις ακόμα. Γίνετε ο πρώτος που θα μοιραστεί την ιστορία του!",
    likes: "Μου αρέσει",
    toggleContrast: "Υψηλή Αντίθεση"
  }
};

// --- Components ---

function DoctorCard({ doctor, t }) {
  return (
    <article className="doctor-card">
      <div className="doctor-header">
        <img 
          src={doctor.image_url} 
          alt={`Profile picture of ${doctor.name}`} 
          className="doctor-avatar"
          loading="lazy"
        />
        <div className="doctor-info">
          <h3>{doctor.name}</h3>
          <span className="doctor-specialty">{doctor.specialty}</span>
        </div>
      </div>
      <div className="doctor-body">
        <div className="doctor-meta">
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{doctor.location}</span>
          </div>
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span>{doctor.hospital}</span>
          </div>
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D94B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>{doctor.rating} / 5.0</span>
          </div>
        </div>
        <p className="doctor-bio">{doctor.bio}</p>
      </div>
      <div className="doctor-footer">
        <button className="btn btn-secondary" aria-label={`View full profile of ${doctor.name}`}>
          {t('viewProfile')}
        </button>
      </div>
    </article>
  );
}

function DoctorDiscovery({ t, lang }) {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    fetch('/api/doctors/specialties')
      .then(res => res.json())
      .then(data => setSpecialties(data))
      .catch(err => console.error("Error fetching specialties:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSpecialty) params.append('specialty', selectedSpecialty);
    if (searchLocation) params.append('location', searchLocation);

    fetch(`/api/doctors?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, [selectedSpecialty, searchLocation]);

  return (
    <div className="discovery-container animate-fade-in">
      <div className="filters-container">
        <div className="input-group">
          <label htmlFor="specialty-filter">{t('specialtyFilter')}</label>
          <select 
            id="specialty-filter" 
            className="form-control"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">{t('allSpecialties')}</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="location-filter">{t('locationFilter')}</label>
          <input 
            type="text" 
            id="location-filter" 
            className="form-control"
            placeholder={t('locationPlaceholder')}
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
      </div>

      <section aria-label="Doctors List">
        {loading ? (
          <div className="loading" aria-live="polite">
            <div className="spinner"></div>
            <p>{t('loadingDoctors')}</p>
          </div>
        ) : doctors.length > 0 ? (
          <div className="doctors-grid" role="list">
            {doctors.map(doctor => (
              <div key={doctor.id} role="listitem">
                <DoctorCard doctor={doctor} t={t} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" aria-live="polite">
            <h3>{t('noDoctors')}</h3>
            <p>{t('noDoctorsDesc')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SocialFeed({ t, lang }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`/api/posts?lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [lang]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setSubmitting(true);
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newPostContent,
        author_name: newPostAuthor.trim() || 'Anonymous',
        language: lang
      })
    })
    .then(res => res.json())
    .then(data => {
      setPosts([data, ...posts]);
      setNewPostContent("");
      setNewPostAuthor("");
      setSubmitting(false);
    })
    .catch(err => {
      console.error("Error submitting post:", err);
      setSubmitting(false);
    });
  };

  return (
    <div className="social-feed animate-fade-in">
      <div className="post-composer">
        <h3>{t('createPostBtn')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <textarea 
              className="form-control"
              placeholder={t('postPlaceholder')}
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
          <div className="post-actions">
            <input 
              type="text" 
              className="form-control"
              placeholder={t('postAuthor')}
              value={newPostAuthor}
              onChange={e => setNewPostAuthor(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || !newPostContent.trim()}>
              {submitting ? "..." : t('submitPost')}
            </button>
          </div>
        </form>
      </div>

      <section aria-label="Social Posts">
        {loading ? (
          <div className="loading" aria-live="polite">
            <div className="spinner"></div>
            <p>{t('loadingPosts')}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">
                    {post.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="post-meta">
                    <h4>{post.author_name}</h4>
                    <span className="post-date">{new Date(post.timestamp).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-US')}</span>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-footer">
                  <button className="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                    <span>{post.likes} {t('likes')}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" aria-live="polite">
            <h3>{t('noPosts')}</h3>
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'social'
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const t = (key) => translations[lang][key] || key;

  return (
    <>
      <header>
        <div className="app-container nav-content">
          <a href="#" className="logo" aria-label={t('appTitle')} onClick={(e) => { e.preventDefault(); setActiveTab('doctors'); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {t('appTitle')}
          </a>
          <nav className="header-actions" aria-label="Main Navigation">
            <select 
              className="lang-switcher" 
              value={lang} 
              onChange={e => setLang(e.target.value)}
              aria-label="Language Switcher"
            >
              <option value="en">English</option>
              <option value="el">Ελληνικά</option>
            </select>
            <button 
              className="btn-icon a11y-btn" 
              onClick={() => setHighContrast(!highContrast)}
              aria-label={t('toggleContrast')}
              title={t('toggleContrast')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20z"></path></svg>
            </button>
            <button className="btn btn-primary">{t('signIn')}</button>
          </nav>
        </div>
      </header>

      <div className="tabs-container app-container">
        <button 
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          {t('tabDoctors')}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          {t('tabSocial')}
        </button>
      </div>
      
      <main className="app-container">
        {activeTab === 'doctors' ? (
          <>
            <h1>{t('docTitle')}</h1>
            <p className="subtitle">{t('docSubtitle')}</p>
            <DoctorDiscovery t={t} lang={lang} />
          </>
        ) : (
          <>
            <h1>{t('feedTitle')}</h1>
            <p className="subtitle">{t('feedSubtitle')}</p>
            <SocialFeed t={t} lang={lang} />
          </>
        )}
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
