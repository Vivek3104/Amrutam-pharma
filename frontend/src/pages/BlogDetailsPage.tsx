import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Heart,
  Bookmark,
  Play,
  Pause,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export interface BlogDetailsPageProps {
  blogId: string;
  onBackToHome: () => void;
  onSelectBlog: (blogId: string) => void;
}

interface ArticleData {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageCaption: string;
  author: string;
  guest: string;
  guestBio: string;
  authorAvatar: string;
  guestAvatar: string;
  date: string;
  readTime: string;
  audioDuration: string;
  pullQuote: string;
  pullQuoteAuthor: string;
  inlineImage1: string;
  inlineImage1Caption: string;
  inlineImage2: string;
  inlineImage2Caption: string;
  chapter1Title: string;
  chapter1Body: string[];
  chapter2Title: string;
  chapter2Body: string[];
  ayurvedicInsights: {
    title: string;
    description: string;
    guna: 'Sattva' | 'Rajas' | 'Tamas';
  }[];
  chapter3Title: string;
  actionSteps: {
    number: string;
    headline: string;
    body: string;
  }[];
  herbalRemedy: {
    name: string;
    subtitle: string;
    herbs: string;
    description: string;
  };
  keyTakeaways: string[];
}

const ARTICLES: Record<string, ArticleData> = {
  'episode-1': {
    id: 'episode-1',
    episodeNumber: 1,
    title: 'Rediscovering Self #1 – “I am not sure if therapy is the right path for me.”',
    subtitle: 'Demystifying mental health taboos, psychological hesitation, and the classical Ayurvedic view of the emotional mind.',
    heroImage: '/assets/blogs/blog_1.jpg',
    heroImageCaption: 'Finding the courage to acknowledge internal turbulence is the first courageous step toward holistic wellness.',
    author: 'Preethi Parthasarathy',
    guest: 'Stuti Ashok Gupta',
    guestBio: 'Principal: Brand & Vision at Amrutam, practicing psychotherapist, and advocate for integrated mental health.',
    authorAvatar: '/assets/blogs/preethi_host.jpg',
    guestAvatar: '/assets/blogs/stuti_guest.jpg',
    date: 'August 19, 2024',
    readTime: '7 min read',
    audioDuration: '34:18',
    pullQuote: 'Therapy is not about being broken or defective; it is about remembering who you were before the world demanded you hide your tenderness.',
    pullQuoteAuthor: 'Stuti Ashok Gupta, Psychotherapist',
    inlineImage1: '/assets/blogs/therapy_journal.jpg',
    inlineImage1Caption: 'Unfiltered daily journaling bridges the conscious mind with submerged emotional patterns.',
    inlineImage2: '/assets/blogs/calm_tea.jpg',
    inlineImage2Caption: 'Evening herbal decoctions of Brahmi and Shankhpushpi quiet an overstimulated central nervous system.',
    chapter1Title: 'The Dilemma & The Hidden Stigma of Reaching Out',
    chapter1Body: [
      'In Indian households, the hesitation toward therapy often wears multiple masks. It rarely presents as a flat refusal; rather, it manifests as quiet rationalization: "Others have it much worse," "I just need a vacation," or "If I talk about this, does it mean I am weak?"',
      'During the premiere episode of Rediscovering Self with Amrutam, host Preethi Parthasarathy sits down with Stuti Ashok Gupta to dismantle the myth that therapy is only reserved for moments of acute collapse. Emotional friction is not an emergency siren; it is a gentle whisper that your inner equilibrium requires mindful tending.',
      'When we suppress chronic emotional distress, our physiology absorbs the unspoken burden. Stress is not purely psychological—it is biological, neurological, and deeply hormonal.',
    ],
    chapter2Title: 'The Ayurvedic Lens: Manas, Doshas & Mind Harmony',
    chapter2Body: [
      'In classical Ayurvedic pathology, the mind (Manas) is not separate from the biological tissues (Dhatus). Just as the body is governed by Vata, Pitta, and Kapha, the psychological realm is shaped by the three Mahagunas: Sattva (clarity and truth), Rajas (kinetic passion and restlessness), and Tamas (inertia and avoidance).',
      'When emotional trauma or chronic overwork disrupts our internal channels (Manovaha Srotas), Rajas surges, creating rapid heart palpitations, catastrophic thoughts, and hyper-vigilance. If left untended, the mind collapses into Tamas—numbness, isolation, and procrastination.',
    ],
    ayurvedicInsights: [
      {
        guna: 'Sattva',
        title: 'Sattvic Mental Harmony',
        description: 'Cultivated through truthful dialogue, meditation, clean whole foods, and non-judgmental awareness of emotions.',
      },
      {
        guna: 'Rajas',
        title: 'Rajasic Agitation & Anxiety',
        description: 'Characterized by frantic multitasking, fear of judgment, restless sleep, and the urge to control every outcome.',
      },
      {
        guna: 'Tamas',
        title: 'Tamasic Avoidance & Fog',
        description: 'Manifests as heavy emotional withdrawal, paralysis in decision-making, and chronic exhaustion.',
      },
    ],
    chapter3Title: '4 Practical Steps Before Your First Therapy Session',
    actionSteps: [
      {
        number: '01',
        headline: 'Name the Emotional Sensation without Rationalizing',
        body: 'Spend 5 minutes every evening sitting quietly. Instead of thinking "I must fix this," observe where the tension lives in your body—the jaw, throat, or solar plexus.',
      },
      {
        number: '02',
        headline: 'Practice Nadi Shodhana (Alternate Nostril Breathing)',
        body: '5 to 10 minutes of balanced pranayama directly regulates the vagus nerve, signaling the parasympathetic system that you are safe in the present moment.',
      },
      {
        number: '03',
        headline: 'Shift from Perfectionism to Micro-Honesty',
        body: 'Therapy does not require you to arrive with an organized portfolio of your life. It only asks for one true sentence about what hurts today.',
      },
      {
        number: '04',
        headline: 'Ground with Classical Medhya Rasayanas',
        body: 'Classical adaptogens like Brahmi, Shankhpushpi, and Ashwagandha protect brain neurons from cortisol-induced degradation.',
      },
    ],
    herbalRemedy: {
      name: 'Amrutam Brainkey Gold Malt',
      subtitle: 'Classical Medhya Rasayana for Mental Fatigue & Serenity',
      herbs: 'Brahmi, Shankhpushpi, Jatamansi, Ashwagandha & Swarna Bhasma',
      description:
        'A classical jam formulation designed to calm neuro-inflammation, stabilize turbulent Vata in the head, and induce restorative deep REM sleep.',
    },
    keyTakeaways: [
      'Hesitation is natural: Reaching out for professional emotional support is an act of self-sovereignty, not defeat.',
      'The body keeps score: Unprocessed emotional conflicts manifest as digestive imbalances, acne, and irregular menstrual cycles.',
      'Small rituals build foundation: Herbal grounding, conscious breathing, and gentle pacing empower therapy to work deeper.',
    ],
  },
  'episode-2': {
    id: 'episode-2',
    episodeNumber: 2,
    title: 'Rediscovering Self #2 – “I procrastinate a LOT!”',
    subtitle: 'Why chronic delay is not a personality flaw, but an emotional regulation strategy of a dysregulated nervous system.',
    heroImage: '/assets/blogs/blog_2.jpg',
    heroImageCaption: 'When facing intense perfectionism, the brain perceives high-stakes tasks as physical threats.',
    author: 'Preethi Parthasarathy',
    guest: 'Rhea Gandhi',
    guestBio: 'Psychodynamic therapist, visiting faculty at St. Xavier’s College, and chairperson of the Indian Chapter of the International Attachment Network.',
    authorAvatar: '/assets/blogs/preethi_host.jpg',
    guestAvatar: '/assets/blogs/stuti_guest.jpg',
    date: 'August 26, 2024',
    readTime: '8 min read',
    audioDuration: '38:45',
    pullQuote: 'Procrastination is rarely a time-management problem. It is an emotion-management problem disguised as laziness.',
    pullQuoteAuthor: 'Rhea Gandhi, Psychodynamic Psychotherapist',
    inlineImage1: '/assets/blogs/therapy_journal.jpg',
    inlineImage1Caption: 'Breaking down overwhelming deadlines into 5-minute micro-commitments dissolves the brain freeze response.',
    inlineImage2: '/assets/blogs/mindful_meditation.jpg',
    inlineImage2Caption: 'Somatic grounding before opening demanding work tasks calms the amygdala alert center.',
    chapter1Title: 'The Myth of Laziness: Deconstructing the Freeze Response',
    chapter1Body: [
      'We often berate ourselves for staring at a blank screen, scrolling endlessly through feeds while a crucial deadline inches closer. The inner dialogue is harsh: "Why am I so undisciplined? Why can everyone else just get it done?"',
      'In this episode of Rediscovering Self, Rhea Gandhi explains that procrastination is actually an involuntary survival response. When a task triggers deep unconscious fears—fear of failure, fear of inadequacy, or even fear of success—the nervous system detects threat and defaults to freeze.',
      'Laziness is a lack of desire to do anything. Procrastination, by contrast, is tortured inaction accompanied by severe guilt, racing thoughts, and self-recrimination.',
    ],
    chapter2Title: 'Rajas and Tamas: The Ayurvedic Cycle of Mental Paralysis',
    chapter2Body: [
      'In Ayurvedic psychology, procrastination begins as acute Rajasic overwhelm (racing anxieties, setting impossibly high standards, mental hyper-drive).',
      'Because the human nervous system cannot sustain extreme Rajas for extended periods without draining Ojas (vital vigor), it plunges into Tamas (inertia, heavy limbs, brain fog, and avoidance).',
      'To break this cycle, one must not use aggressive self-punishment (which only adds more Rajas). Instead, one must introduce Sattva—gentle structure, nourishing hydration, and compassionate pacing.',
    ],
    ayurvedicInsights: [
      {
        guna: 'Rajas',
        title: 'Perfectionist Overdrive',
        description: 'Impossibly high inner standards that make taking the first step feel terrifyingly catastrophic.',
      },
      {
        guna: 'Tamas',
        title: 'The Protective Freeze',
        description: 'Numbing out with distractions because the nervous system feels unable to safely handle the task.',
      },
      {
        guna: 'Sattva',
        title: 'Micro-Action & Compassion',
        description: 'Focusing solely on the next 120 seconds with unconditional kindness toward oneself.',
      },
    ],
    chapter3Title: '4 Psychological Tools to Break Chronic Inertia',
    actionSteps: [
      {
        number: '01',
        headline: 'Lower the Bar to the Floor (The 2-Minute Rule)',
        body: 'Do not commit to finishing the report. Commit only to opening the document and typing one sentence. Permission to write poorly destroys the freeze.',
      },
      {
        number: '02',
        headline: 'Identify the Underlying Emotion',
        body: 'Ask yourself: "What feeling am I avoiding right now?" Is it fear of being judged, fear of being exposed, or resentment toward the person who assigned it?',
      },
      {
        number: '03',
        headline: 'Regulate the Physical Nervous System First',
        body: 'Splash cold water on your eyes, drink a glass of warm herbal water, or take 10 deep belly breaths before attempting the task.',
      },
      {
        number: '04',
        headline: 'Restore Pranic Rhythm with Shankhpushpi & Ashwagandha',
        body: 'Daily herbal tonics prevent the adrenal spikes that trigger the freeze mechanism in the first place.',
      },
    ],
    herbalRemedy: {
      name: 'Amrutam Ashwagandha & Shankhpushpi Rasayana',
      subtitle: 'Neural Rebalancing Herbal Elixir',
      herbs: 'Ashwagandha, Shankhpushpi, Brahmi, Tulsi & Vacha',
      description:
        'Soothes the acute fight-or-freeze trigger in the amygdala, clears cognitive lethargy, and enhances mental clarity for creative flow states.',
    },
    keyTakeaways: [
      'Procrastination is protective: Your brain is trying to shield you from emotional discomfort.',
      'Shame fuels more delay: The harder you beat yourself up, the more frozen you will become tomorrow.',
      'Somatic ease precedes mental flow: Calm your physical body before expecting your mind to produce brilliant work.',
    ],
  },
  'episode-3': {
    id: 'episode-3',
    episodeNumber: 3,
    title: 'Rediscovering Self #3 – “I’m scared of confrontation”',
    subtitle: 'Navigating boundary-setting, people-pleasing fatigue, and expressing needs without drowning in relational guilt.',
    heroImage: '/assets/blogs/blog_3.jpg',
    heroImageCaption: 'Learning to say a graceful "No" without apology creates healthy space for authentic connection.',
    author: 'Preethi Parthasarathy',
    guest: 'Ishani Badyal',
    guestBio: 'Relational psychologist-psychotherapist with extensive experience in personality dynamics and attachment healing.',
    authorAvatar: '/assets/blogs/preethi_host.jpg',
    guestAvatar: '/assets/blogs/stuti_guest.jpg',
    date: 'September 02, 2024',
    readTime: '7 min read',
    audioDuration: '36:12',
    pullQuote: 'Conflict is not the end of closeness; in healthy relationships, respectful confrontation is the exact doorway to genuine intimacy.',
    pullQuoteAuthor: 'Ishani Badyal, Relational Psychologist',
    inlineImage1: '/assets/blogs/calm_tea.jpg',
    inlineImage1Caption: 'Holding grounded space in conversation begins with breath awareness in the chest and throat.',
    inlineImage2: '/assets/blogs/mindful_meditation.jpg',
    inlineImage2Caption: 'Recognizing that others’ emotions are their own responsibility frees you from chronic fawning.',
    chapter1Title: 'The High Cost of Being "Too Nice": The Fawn Reflex',
    chapter1Body: [
      'Have you ever found yourself saying "yes" to an exhausting favor before the sentence was even finished leaving the other person’s mouth? Or apologized for something you did not cause, purely to dissolve the tense atmosphere in the room?',
      'In this compelling episode, host Preethi Parthasarathy and psychologist Ishani Badyal unpack the psychology of conflict avoidance. Many of us learned in childhood that love, safety, and belonging were conditional upon keeping everyone else calm.',
      'This survival adaptation is called the "fawn response." Over decades, constant self-abandonment breeds deep internal resentment, chronic throat tension, and identity fatigue.',
    ],
    chapter2Title: 'Vishuddha Chakra and the Voice of Truth (Satya)',
    chapter2Body: [
      'Ayurvedic and Yogic texts place particular focus on Vishuddha—the throat energetic center—and the ethical pillar of Satya (truthfulness in thought, word, and deed).',
      'When we suppress our authentic boundaries to appease others, we block the flow of Udana Vata—the sub-dosha responsible for speech, self-expression, and vital immunity.',
      'Repressed confrontation frequently translates physically into recurrent throat infections, thyroid imbalances, chronic neck tightness, and emotional hyper-acidity.',
    ],
    ayurvedicInsights: [
      {
        guna: 'Tamas',
        title: 'Passive Resentment',
        description: 'Swallowing your truth, silently boiling inside, and growing emotionally detached from loved ones.',
      },
      {
        guna: 'Rajas',
        title: 'Explosive Outbursts',
        description: 'Letting boundary violations accumulate until an insignificant event triggers an uncontrollable emotional storm.',
      },
      {
        guna: 'Sattva',
        title: 'Calm Assertive Truth',
        description: 'Speaking your boundary with kindness, steady eye contact, and zero urge to over-explain or justify.',
      },
    ],
    chapter3Title: '4 Relational Mantras to Speak Your Truth Safely',
    actionSteps: [
      {
        number: '01',
        headline: 'Pause Before the Automatic "Yes"',
        body: 'Give yourself a 24-hour rule. Practice saying: "Let me check my commitments and get back to you by tomorrow afternoon."',
      },
      {
        number: '02',
        headline: 'Separate Discomfort from Danger',
        body: 'When setting a boundary, your body will feel a spike of anxiety. Remind yourself: "I am feeling uncomfortable, but I am entirely safe."',
      },
      {
        number: '03',
        headline: 'Use "I" Statements without Counter-Attacking',
        body: 'Say: "When plans change without notice, I feel unconsidered and overwhelmed," rather than: "You never respect my time."',
      },
      {
        number: '04',
        headline: 'Support the Throat Center with Licorice & Yashtimadhu',
        body: 'Herbal infusions of Yashtimadhu (Licorice) and Tulsi soothe the throat tissues and calm the chest tightness of unspoken words.',
      },
    ],
    herbalRemedy: {
      name: 'Amrutam Kuntal & Prana Throat Soother',
      subtitle: 'Herbal Decoction for Communication & Vital Calm',
      herbs: 'Yashtimadhu, Tulsi, Cardamom, Pippali & Mulethi',
      description:
        'Soothes physiological strain along the neck, dissolves nervous constriction in the vocal chords, and grounds the respiratory prana.',
    },
    keyTakeaways: [
      'Boundaries are not walls: They are clear instructions on how someone can love you without hurting you.',
      'People-pleasing is self-betrayal: Saying yes to everyone else always means saying no to your own well-being.',
      'Disappointment is survivable: Other adults are fully capable of handling your gentle, honest boundary.',
    ],
  },
};

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({
  blogId,
  onBackToHome,
  onSelectBlog,
}) => {
  const article = ARTICLES[blogId] || ARTICLES['episode-1'];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [clapCount, setClapCount] = useState(48);
  const [hasClapped, setHasClapped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlayingAudio(false);
  }, [blogId]);

  const handleClap = () => {
    setClapCount((prev) => prev + 1);
    setHasClapped(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const relatedArticles = Object.values(ARTICLES).filter((a) => a.id !== article.id);

  return (
    <div
      id="blog-details-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#FCFAF6',
        color: '#243A2C',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        /* Reading Progress Bar */
        .reading-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #3A643B, #85E3A1);
          z-index: 99999;
          transition: width 0.1s ease-out;
        }

        .article-content-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .drop-cap:first-letter {
          font-family: 'Playfair Display', Georgia, serif;
          float: left;
          font-size: 72px;
          line-height: 60px;
          padding-top: 4px;
          padding-right: 12px;
          padding-bottom: 4px;
          color: #1F422C;
          font-weight: 700;
        }

        .pull-quote-box {
          border-left: 4px solid #C05621;
          background: #F4EDE0;
          padding: 24px 30px;
          border-radius: 0 16px 16px 0;
          margin: 36px 0;
          position: relative;
        }

        .pull-quote-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(19px, 2.4vw, 24px);
          font-style: italic;
          color: #213B2A;
          line-height: 1.5;
          margin: 0 0 10px 0;
        }

        .pull-quote-author {
          font-size: 13.5px;
          font-weight: 700;
          color: #92400E;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .audio-player-card {
          background: linear-gradient(135deg, #244633 0%, #173223 100%);
          color: #FFFFFF;
          border-radius: 20px;
          padding: 24px 28px;
          margin: 36px 0 48px;
          box-shadow: 0 14px 36px rgba(25, 45, 35, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .audio-play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #85E3A1;
          color: #173223;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
          flex-shrink: 0;
        }

        .audio-play-btn:hover {
          transform: scale(1.08);
          background: #A3F1BC;
        }

        .wave-bar {
          width: 4px;
          height: 16px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 2px;
          display: inline-block;
          margin: 0 2px;
        }

        .wave-bar.playing {
          animation: waveAnimation 1.2s infinite ease-in-out;
        }

        @keyframes waveAnimation {
          0%, 100% { height: 8px; }
          50% { height: 26px; background: #85E3A1; }
        }

        .step-number-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background-color: #E6EFE9;
          color: #264A35;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .herbal-remedy-card {
          background: #F3ECE1;
          border: 1px solid #DFD5C4;
          border-radius: 18px;
          padding: 26px 30px;
          margin: 36px 0;
        }

        .related-card-item {
          background: #FFFFFF;
          border: 1px solid #E9E4D8;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .related-card-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(35, 60, 45, 0.14);
        }

        .floating-action-bar {
          position: sticky;
          bottom: 24px;
          max-width: 320px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 9999px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
          border: 1px solid #E2DED4;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 800;
        }

        .interactive-icon-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: #2F4C39;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .interactive-icon-btn:hover {
          background: #F0F6F2;
          color: #173223;
        }
      `}</style>

      {/* Reading Progress Indicator Bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Top Editorial Navbar */}
      <header
        style={{
          borderBottom: '1px solid #ECE7DD',
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={onBackToHome}
          style={{
            background: '#F0F5F1',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#214232',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#E2ECE5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F0F5F1')}
        >
          <ArrowLeft size={16} />
          <span>Back to Journal</span>
        </button>

        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#2C5740',
            textTransform: 'uppercase',
          }}
        >
          AMRUTAM JOURNAL
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              backgroundColor: '#EBF4EE',
              color: '#274C37',
              padding: '6px 14px',
              borderRadius: '9999px',
            }}
          >
            PODCAST EPISODE #{article.episodeNumber}
          </span>
        </div>
      </header>

      {/* Main Article Container */}
      <article style={{ padding: 'clamp(32px, 5vw, 64px) 0 80px' }}>
        <div className="article-content-container">
          
          {/* Tag & Meta Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#C05621',
                backgroundColor: '#FDEEE4',
                padding: '4px 12px',
                borderRadius: '4px',
              }}
            >
              REDISCOVERING SELF
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6A7D71', fontSize: '13.5px' }}>
              <Calendar size={14} />
              <span>{article.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6A7D71', fontSize: '13.5px' }}>
              <Clock size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Article Main Headline */}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)',
              fontWeight: 600,
              color: '#183826',
              lineHeight: 1.22,
              margin: '0 0 20px 0',
              letterSpacing: '-0.015em',
            }}
          >
            {article.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.6,
              color: '#465E50',
              margin: '0 0 28px 0',
              fontWeight: 400,
            }}
          >
            {article.subtitle}
          </p>

          {/* Author & Guest Byline Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              borderTop: '1px solid #E8E2D6',
              borderBottom: '1px solid #E8E2D6',
              padding: '16px 0',
              marginBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={article.authorAvatar}
                alt={article.author}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#1B3827' }}>
                  Hosted by {article.author}
                </div>
                <div style={{ fontSize: '12.5px', color: '#657A6D' }}>
                  Featuring guest {article.guest}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: '1px solid #C8D8CE',
                  borderRadius: '9999px',
                  padding: '7px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#274C37',
                }}
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                style={{
                  background: isBookmarked ? '#274C37' : 'none',
                  color: isBookmarked ? '#FFFFFF' : '#274C37',
                  border: '1px solid #C8D8CE',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Hero Feature Image */}
          <div style={{ margin: '0 0 36px 0' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                aspectRatio: '16 / 10',
                backgroundColor: '#EBE5D9',
                boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={article.heroImage}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p
              style={{
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#6F8477',
                margin: '10px 0 0 0',
                textAlign: 'center',
              }}
            >
              {article.heroImageCaption}
            </p>
          </div>

          {/* Interactive Podcast Player Bar */}
          <div className="audio-player-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="audio-play-btn"
                aria-label={isPlayingAudio ? 'Pause episode' : 'Play episode'}
              >
                {isPlayingAudio ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
              </button>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '0.01em' }}>
                  {isPlayingAudio ? 'Now Playing Podcast Episode' : 'Listen to Episode Audio'}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                  Rediscovering Self with Amrutam • Duration: {article.audioDuration}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className={`wave-bar ${isPlayingAudio ? 'playing' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* CHAPTER 1 */}
          <section style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                fontWeight: 600,
                color: '#183826',
                margin: '0 0 18px 0',
              }}
            >
              {article.chapter1Title}
            </h2>

            <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#2C4234' }}>
              <p className="drop-cap" style={{ margin: '0 0 20px 0' }}>
                {article.chapter1Body[0]}
              </p>
              {article.chapter1Body.slice(1).map((para, i) => (
                <p key={i} style={{ margin: '0 0 20px 0' }}>
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Styled Pull Quote */}
          <div className="pull-quote-box">
            <p className="pull-quote-text">“{article.pullQuote}”</p>
            <div className="pull-quote-author">— {article.pullQuoteAuthor}</div>
          </div>

          {/* CHAPTER 2: Ayurvedic Guna Lens */}
          <section style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                fontWeight: 600,
                color: '#183826',
                margin: '0 0 18px 0',
              }}
            >
              {article.chapter2Title}
            </h2>

            <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#2C4234', marginBottom: '28px' }}>
              {article.chapter2Body.map((para, i) => (
                <p key={i} style={{ margin: '0 0 20px 0' }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Ayurvedic Gunas 3-Card Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              {article.ayurvedicInsights.map((insight, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DFD9CB',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: insight.guna === 'Sattva' ? '#2E6B47' : insight.guna === 'Rajas' ? '#C05621' : '#4B5563',
                      backgroundColor: insight.guna === 'Sattva' ? '#E9F5ED' : insight.guna === 'Rajas' ? '#FEECE4' : '#F3F4F6',
                      padding: '3px 10px',
                      borderRadius: '4px',
                    }}
                  >
                    {insight.guna} State
                  </span>
                  <h4 style={{ margin: '12px 0 8px', fontSize: '16px', fontWeight: 700, color: '#1B3827' }}>
                    {insight.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: '#566B5E' }}>
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Inline Image Interspersed */}
          <div style={{ margin: '36px 0' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                backgroundColor: '#EBE5D9',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={article.inlineImage1}
                alt="Therapeutic journaling reflection"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#6F8477', margin: '10px 0 0 0', textAlign: 'center' }}>
              {article.inlineImage1Caption}
            </p>
          </div>

          {/* CHAPTER 3: Practical Action Steps */}
          <section style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                fontWeight: 600,
                color: '#183826',
                margin: '0 0 24px 0',
              }}
            >
              {article.chapter3Title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {article.actionSteps.map((step) => (
                <div
                  key={step.number}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5DFD1',
                    borderRadius: '16px',
                    padding: '20px',
                  }}
                >
                  <div className="step-number-badge">{step.number}</div>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1B3827' }}>
                      {step.headline}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: '#44584C' }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Ayurvedic Herbal Remedy Card */}
          <div className="herbal-remedy-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#274C37', marginBottom: '8px' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Ayurvedic Supportive Formulation
              </span>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#1B3827' }}>
              {article.herbalRemedy.name}
            </h3>
            <div style={{ fontSize: '13.5px', color: '#C05621', fontWeight: 600, marginBottom: '12px' }}>
              Key Herbs: {article.herbalRemedy.herbs}
            </div>
            <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65, color: '#43584B' }}>
              {article.herbalRemedy.description}
            </p>
          </div>

          {/* Key Takeaways Card */}
          <div
            style={{
              backgroundColor: '#1E3E2B',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px 32px',
              margin: '40px 0',
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: 600,
                margin: '0 0 16px 0',
                color: '#85E3A1',
              }}
            >
              Key Reflections to Carry Forward
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {article.keyTakeaways.map((item, idx) => (
                <li key={idx} style={{ fontSize: '15px', lineHeight: 1.6, color: '#E1EFE7' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Next Reads */}
          <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid #E5DFD1' }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '24px',
                fontWeight: 600,
                color: '#1B3827',
                margin: '0 0 24px 0',
              }}
            >
              Explore Next in the Podcast Series
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectBlog(rel.id)}
                  className="related-card-item"
                >
                  <div style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                    <img
                      src={rel.heroImage}
                      alt={rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#C05621',
                        letterSpacing: '0.04em',
                        marginBottom: '6px',
                      }}
                    >
                      EPISODE #{rel.episodeNumber} • {rel.readTime}
                    </span>
                    <h4
                      style={{
                        margin: '0 0 10px',
                        fontSize: '15.5px',
                        fontWeight: 700,
                        color: '#1B3827',
                        lineHeight: 1.4,
                      }}
                    >
                      {rel.title}
                    </h4>
                    <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#5A6E62', lineHeight: 1.5 }}>
                      {rel.subtitle.slice(0, 110)}...
                    </p>
                    <div
                      style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#274C37',
                      }}
                    >
                      <span>Read Episode Summary</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </article>

      {/* Floating Reader Engagement Bar */}
      <div className="floating-action-bar">
        <button onClick={handleClap} className="interactive-icon-btn">
          <Heart size={18} fill={hasClapped ? '#DC2626' : 'none'} color={hasClapped ? '#DC2626' : 'currentColor'} />
          <span>{clapCount}</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: '#E2DED4' }} />

        <button onClick={handleShare} className="interactive-icon-btn">
          <Share2 size={17} />
          <span>{copiedLink ? 'Copied!' : 'Share'}</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: '#E2DED4' }} />

        <button onClick={() => setIsBookmarked(!isBookmarked)} className="interactive-icon-btn">
          <Bookmark size={17} fill={isBookmarked ? '#274C37' : 'none'} />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

    </div>
  );
};

export default BlogDetailsPage;
