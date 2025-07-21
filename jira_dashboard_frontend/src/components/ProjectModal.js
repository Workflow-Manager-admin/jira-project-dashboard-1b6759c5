import React, { useEffect } from 'react';
import './ProjectModal.css';

// PUBLIC_INTERFACE
/**
 * Modal component for displaying detailed project information
 */
const ProjectModal = ({ project, projectDetails, loading, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Handles backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Formats date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Gets project avatar URL with fallback
   */
  const getAvatarUrl = () => {
    if (!project.avatar_urls) return null;
    return project.avatar_urls['48x48'] || project.avatar_urls['24x24'] || null;
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="project-header-info">
            <div className="project-avatar-large">
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()} alt={`${project.name} avatar`} />
              ) : (
                <div className="project-avatar-fallback-large">
                  {project.key?.substring(0, 2) || project.name?.substring(0, 2) || '??'}
                </div>
              )}
            </div>
            <div>
              <h2>{project.name}</h2>
              <span className="project-key-large">{project.key}</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="loading-spinner-modal"></div>
              <p>Loading project details...</p>
            </div>
          ) : projectDetails?.error ? (
            <div className="modal-error">
              <div className="error-icon">❌</div>
              <h3>Failed to load details</h3>
              <p>{projectDetails.error}</p>
            </div>
          ) : projectDetails ? (
            <div className="project-details">
              <section className="detail-section">
                <h3>Description</h3>
                <p>{projectDetails.description || 'No description available'}</p>
              </section>

              <div className="details-grid">
                <section className="detail-section">
                  <h3>Project Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Type:</span>
                      <span className="info-value project-type-badge">
                        {projectDetails.project_type || 'Unknown'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Category:</span>
                      <span className="info-value">{projectDetails.category || 'Uncategorized'}</span>
                    </div>
                    {projectDetails.created_date && (
                      <div className="info-item">
                        <span className="info-label">Created:</span>
                        <span className="info-value">{formatDate(projectDetails.created_date)}</span>
                      </div>
                    )}
                    {projectDetails.lead && (
                      <div className="info-item">
                        <span className="info-label">Lead:</span>
                        <span className="info-value">
                          {projectDetails.lead.display_name}
                          {projectDetails.lead.email && (
                            <span className="lead-email"> ({projectDetails.lead.email})</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </section>

                {projectDetails.issue_types && projectDetails.issue_types.length > 0 && (
                  <section className="detail-section">
                    <h3>Issue Types ({projectDetails.issue_types.length})</h3>
                    <div className="issue-types-grid">
                      {projectDetails.issue_types.map(issueType => (
                        <div key={issueType.id} className="issue-type-item">
                          {issueType.icon_url && (
                            <img src={issueType.icon_url} alt={issueType.name} className="issue-type-icon" />
                          )}
                          <div>
                            <div className="issue-type-name">{issueType.name}</div>
                            <div className="issue-type-description">{issueType.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {projectDetails.components && projectDetails.components.length > 0 && (
                <section className="detail-section">
                  <h3>Components ({projectDetails.components.length})</h3>
                  <div className="components-grid">
                    {projectDetails.components.map(component => (
                      <div key={component.id} className="component-item">
                        <div className="component-name">{component.name}</div>
                        <div className="component-description">{component.description}</div>
                        <div className="component-lead">Lead: {component.lead}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {projectDetails.versions && projectDetails.versions.length > 0 && (
                <section className="detail-section">
                  <h3>Versions ({projectDetails.versions.length})</h3>
                  <div className="versions-grid">
                    {projectDetails.versions.map(version => (
                      <div key={version.id} className="version-item">
                        <div className="version-header">
                          <span className="version-name">{version.name}</span>
                          <span className={`version-status ${version.released ? 'released' : 'unreleased'}`}>
                            {version.released ? 'Released' : 'Unreleased'}
                          </span>
                        </div>
                        <div className="version-description">{version.description}</div>
                        {version.release_date && (
                          <div className="version-date">
                            Release Date: {formatDate(version.release_date)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="basic-project-info">
              <section className="detail-section">
                <h3>Description</h3>
                <p>{project.description || 'No description available'}</p>
              </section>

              <section className="detail-section">
                <h3>Project Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Type:</span>
                    <span className="info-value project-type-badge">{project.project_type || 'Unknown'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{project.category || 'Uncategorized'}</span>
                  </div>
                  {project.created_date && (
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">{formatDate(project.created_date)}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
