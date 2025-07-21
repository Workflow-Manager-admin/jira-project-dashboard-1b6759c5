import React, { useState } from 'react';
import './ProjectCard.css';

// PUBLIC_INTERFACE
/**
 * Individual project card component with hover effects and click handling
 */
const ProjectCard = ({ project, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // PUBLIC_INTERFACE
  /**
   * Handles project card click with project details
   */
  const handleClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Formats date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (imageError || !project.avatar_urls) return null;
    return project.avatar_urls['48x48'] || project.avatar_urls['24x24'] || null;
  };

  return (
    <div className="project-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="project-card-header">
        <div className="project-avatar">
          {getAvatarUrl() ? (
            <img
              src={getAvatarUrl()}
              alt={`${project.name} avatar`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="project-avatar-fallback">
              {project.key?.substring(0, 2) || project.name?.substring(0, 2) || '??'}
            </div>
          )}
        </div>
        <div className="project-info">
          <h3 className="project-name">{project.name}</h3>
          <span className="project-key">{project.key}</span>
        </div>
      </div>

      <div className="project-description">
        <p>{project.description || 'No description available'}</p>
      </div>

      <div className="project-metadata">
        <div className="metadata-row">
          <span className="metadata-label">Type:</span>
          <span className="metadata-value project-type">{project.project_type || 'Unknown'}</span>
        </div>
        
        <div className="metadata-row">
          <span className="metadata-label">Category:</span>
          <span className="metadata-value">{project.category || 'Uncategorized'}</span>
        </div>

        {project.lead && (
          <div className="metadata-row">
            <span className="metadata-label">Lead:</span>
            <span className="metadata-value">{project.lead.display_name}</span>
          </div>
        )}

        {project.created_date && (
          <div className="metadata-row">
            <span className="metadata-label">Created:</span>
            <span className="metadata-value">{formatDate(project.created_date)}</span>
          </div>
        )}
      </div>

      {project.issue_types && project.issue_types.length > 0 && (
        <div className="project-issue-types">
          <span className="metadata-label">Issue Types:</span>
          <div className="issue-types-list">
            {project.issue_types.slice(0, 4).map(issueType => (
              <span key={issueType.id} className="issue-type-badge">
                {issueType.name}
              </span>
            ))}
            {project.issue_types.length > 4 && (
              <span className="issue-type-badge more">
                +{project.issue_types.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="project-card-footer">
        <span className="click-hint">Click to view details →</span>
      </div>
    </div>
  );
};

export default ProjectCard;
