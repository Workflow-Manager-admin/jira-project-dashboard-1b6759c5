import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProjects, fetchProjectDetails } from '../services/api';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Main dashboard component displaying user's Jira projects
 */
const Dashboard = () => {
  const { user, credentials, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    loadProjects();
  }, [credentials]); // eslint-disable-line react-hooks/exhaustive-deps

  // PUBLIC_INTERFACE
  /**
   * Loads user projects from the API
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchUserProjects(credentials);
      
      if (response.success) {
        setProjects(response.projects || []);
      } else {
        throw new Error(response.message || 'Failed to load projects');
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handles project card click to show details
   */
  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setDetailsLoading(true);
    setProjectDetails(null);

    try {
      const response = await fetchProjectDetails(project.key, credentials);
      if (response.success) {
        setProjectDetails(response.project);
      } else {
        throw new Error(response.message || 'Failed to load project details');
      }
    } catch (err) {
      setProjectDetails({ error: err.message });
    } finally {
      setDetailsLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Closes the project details modal
   */
  const handleCloseModal = () => {
    setSelectedProject(null);
    setProjectDetails(null);
  };

  // PUBLIC_INTERFACE
  /**
   * Filters projects based on search term
   */
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // PUBLIC_INTERFACE
  /**
   * Handles retry action for failed requests
   */
  const handleRetry = () => {
    loadProjects();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="user-info">
            <h1>Welcome, {user?.display_name || 'User'}!</h1>
            <p>Loading your Jira projects...</p>
          </div>
          <button onClick={logout} className="logout-button">
            Sign Out
          </button>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching your projects from Jira...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="user-info">
            <h1>Welcome, {user?.display_name || 'User'}!</h1>
          </div>
          <button onClick={logout} className="logout-button">
            Sign Out
          </button>
        </div>
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Failed to load projects</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
            <button onClick={logout} className="logout-link">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {user?.display_name || 'User'}!</h1>
          <p>You have access to {projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={logout} className="logout-button">
          Sign Out
        </button>
      </div>

      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects by name, key, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
        
        <div className="project-count">
          {searchTerm && (
            <span>
              {filteredProjects.length} of {projects.length} projects
            </span>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>{searchTerm ? 'No matching projects' : 'No projects found'}</h2>
          <p>
            {searchTerm 
              ? 'Try adjusting your search terms or clear the search to see all projects.'
              : 'It looks like you don\'t have access to any Jira projects yet.'
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="clear-search-button"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          projectDetails={projectDetails}
          loading={detailsLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
