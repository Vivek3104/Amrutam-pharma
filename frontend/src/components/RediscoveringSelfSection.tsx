import React from 'react';

export interface BlogItem {
  id: string;
  episodeNumber: number;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  guest: string;
}

export const BLOG_ITEMS: BlogItem[] = [
  {
    id: 'episode-1',
    episodeNumber: 1,
    title: 'Rediscovering Self #1 – “I am not sure if therapy is the right path for me.”',
    excerpt:
      'In the first episode of the Rediscovering Self with Amrutam podcast, host Preethi Parthasarathy explores the theme "I am not sure if therapy is the right path for me" with Stuti Ashok Gupta...',
    image: '/assets/blogs/blog_1.jpg',
    readTime: '6 min read',
    guest: 'Stuti Ashok Gupta',
  },
  {
    id: 'episode-2',
    episodeNumber: 2,
    title: 'Rediscovering Self #2 – “I procrastinate a LOT!”',
    excerpt:
      'In the second episode of the Rediscovering Self with Amrutam podcast, host Preethi Parthasarathy explores the theme "I procrastinate a LOT!" with Rhea Gandhi, exploring emotional dysregulation...',
    image: '/assets/blogs/blog_2.jpg',
    readTime: '8 min read',
    guest: 'Rhea Gandhi',
  },
  {
    id: 'episode-3',
    episodeNumber: 3,
    title: 'Rediscovering Self #3 – “I’m scared of confrontation”',
    excerpt:
      'In the third episode of the Rediscovering Self with Amrutam podcast, host Preethi Parthasarathy explores the theme "I’m scared of confrontation" with psychologist Ishani Badyal...',
    image: '/assets/blogs/blog_3.jpg',
    readTime: '7 min read',
    guest: 'Ishani Badyal',
  },
];

interface RediscoveringSelfSectionProps {
  onSelectBlog: (blogId: string) => void;
}

export const RediscoveringSelfSection: React.FC<RediscoveringSelfSectionProps> = ({
  onSelectBlog,
}) => {
  return (
    <section
      id="rediscovering-self-section"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(52px, 7vw, 88px) 20px clamp(56px, 7vw, 92px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderTop: '1px solid #EEF3EF',
      }}
    >
      <style>{`
        .blog-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4.2vw, 3rem);
          font-weight: 600;
          color: #1A3828;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.015em;
          text-align: center;
        }

        .blog-accent-bar {
          width: 44px;
          height: 3px;
          background-color: #3A643B;
          border-radius: 999px;
          margin: 14px auto clamp(36px, 4.5vw, 52px) auto;
        }

        .blog-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 3vw, 36px);
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
        }

        @media (max-width: 960px) {
          .blog-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 600px) {
          .blog-grid-container {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        .blog-card-item {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .blog-card-item:hover {
          transform: translateY(-8px);
        }

        .blog-card-item:active {
          transform: translateY(-2px) scale(0.99);
        }

        .blog-image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1.05 / 1;
          border-radius: 26px;
          overflow: hidden;
          background-color: #EDE8DE;
          box-shadow: 0 8px 24px rgba(35, 60, 45, 0.08);
          margin-bottom: 18px;
          transition: box-shadow 0.35s ease;
        }

        .blog-card-item:hover .blog-image-box {
          box-shadow: 0 16px 36px -8px rgba(35, 60, 45, 0.22);
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .blog-card-item:hover .blog-card-img {
          transform: scale(1.05);
        }

        .blog-item-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16.5px;
          font-weight: 700;
          color: #1A3828;
          line-height: 1.45;
          margin: 0 0 10px 0;
          transition: color 0.25s ease;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-item:hover .blog-item-title {
          color: #2F6C47;
        }

        .blog-item-excerpt {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px;
          line-height: 1.6;
          color: #586B60;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div style={{ maxWidth: '1160px', width: '100%', margin: '0 auto' }}>
        {/* Title */}
        <h2 className="blog-section-title">Rediscovering Self With Amrutam</h2>

        {/* Accent Bar */}
        <div className="blog-accent-bar" aria-hidden="true" />

        {/* Blog Cards Grid */}
        <div className="blog-grid-container">
          {BLOG_ITEMS.map((item) => (
            <div
              key={item.id}
              className="blog-card-item"
              role="button"
              tabIndex={0}
              onClick={() => onSelectBlog(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBlog(item.id);
                }
              }}
              aria-label={`Read article: ${item.title}`}
            >
              <div className="blog-image-box">
                <img
                  src={item.image}
                  alt={item.title}
                  className="blog-card-img"
                  loading="lazy"
                />
              </div>

              <h3 className="blog-item-title">
                {item.title}
              </h3>

              <p className="blog-item-excerpt">
                {item.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RediscoveringSelfSection;
