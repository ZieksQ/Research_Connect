import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getAllSurvey } from '../../services/survey/survey.service'
import { useNavigate } from 'react-router-dom'
import { MdAccessTime, MdPeople } from 'react-icons/md'

// Posts section in Profile Page
const ProfilePostsPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllSurvey();
      // normalize response to array
      const list = Array.isArray(data?.message) ? data.message : [];
      setSurveys(list);
    } catch (err) {
      console.error('Error fetching surveys for profile posts:', err);
      setError('Failed to load posts');
      setSurveys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const username = userInfo?.message?.user_info?.username || null;
  const program = userInfo?.message?.user_info?.program || null;

  const myPosts = surveys.filter((s) => s.user_username === username);

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6">
        <div className="text-center text-error">{error}</div>
      </section>
    );
  }

  if (!username) {
    return (
      <section className="py-6">
        <div className="text-center text-text-secondary">User data not loaded yet.</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {myPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '1rem', opacity: 0.3 }}>📭</div>
          <p className="text-text-secondary">You have not published any surveys yet.</p>
        </div>
      ) : (
        myPosts.map((post) => (
          <article
            key={post.pk_survey_id}
            className="rounded-xl shadow-sm hover:shadow-md transition-shadow"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-shade-primary)',
              padding: 'clamp(1.25rem, 2vw, 1.5rem)'
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="avatar">
                  <div
                    className="rounded-full"
                    style={{
                      width: 'clamp(2.5rem, 4vw, 3rem)',
                      height: 'clamp(2.5rem, 4vw, 3rem)'
                    }}
                  >
                    <img src={post.user_profile} alt={post.user_username} className="object-cover w-full h-full rounded-full" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3
                    style={{
                      color: 'var(--color-primary-color)',
                      fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
                      fontWeight: '600',
                      marginBottom: 'clamp(0.125rem, 0.25vw, 0.25rem)'
                    }}
                  >
                    {post.user_username}
                  </h3>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'clamp(0.6875rem, 1.25vw, 0.8125rem)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {post.survey_category?.[0] || 'UNCATEGORIZED'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
              <p
                style={{
                  color: 'var(--color-primary-color)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: '1.6',
                  marginBottom: 'clamp(0.75rem, 1.25vw, 1rem)'
                }}
              >
                {post.survey_title}
              </p>

              <p className="text-text-secondary" style={{ marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                {post.survey_content}
              </p>

              <div className="flex flex-wrap gap-2">
                {post.survey_category?.map((tag, i) => (
                  <div
                    key={i}
                    className="badge badge-sm"
                    style={{
                      backgroundColor: 'var(--color-secondary-background)',
                      color: 'var(--color-accent-100)',
                      border: 'none',
                      fontSize: 'clamp(0.6875rem, 1.15vw, 0.8125rem)',
                      padding: 'clamp(0.375rem, 0.75vw, 0.5rem) clamp(0.625rem, 1.25vw, 0.875rem)',
                      fontWeight: '500'
                    }}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <MdAccessTime style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: '#22c55e' }} />
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }}>
                    {post.survey_date_created ? new Date(post.survey_date_created).toLocaleDateString() : ''}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MdPeople style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: 'var(--color-accent-100)' }} />
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)' }} title={post.survey_target_audience?.join(', ')}>
                    {post.survey_target_audience?.join(', ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/form/result/${post.pk_survey_id}`)}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'var(--color-accent-100)',
                  borderColor: 'var(--color-accent-100)',
                  color: '#ffffff',
                  fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
                  padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 1.75vw, 1.5rem)',
                  fontWeight: '600',
                  height: 'auto',
                  minHeight: 'clamp(2rem, 3vw, 2.5rem)',
                  borderRadius: 'clamp(0.375rem, 0.75vw, 0.5rem)'
                }}
              >
                View Results
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  )
}

export default ProfilePostsPage
