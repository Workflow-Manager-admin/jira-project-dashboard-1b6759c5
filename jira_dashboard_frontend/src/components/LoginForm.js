import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginForm.css';

// PUBLIC_INTERFACE
/**
 * Login form component for Jira authentication
 */
const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    api_token: '',
    domain: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // PUBLIC_INTERFACE
  /**
   * Handles input changes with validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Validates form data before submission
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.api_token.trim()) {
      errors.api_token = 'API token is required';
    }

    if (!formData.domain.trim()) {
      errors.domain = 'Domain is required';
    }

    return errors;
  };

  // PUBLIC_INTERFACE
  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Normalize domain format
    let normalizedDomain = formData.domain.trim();
    if (!normalizedDomain.startsWith('http')) {
      if (!normalizedDomain.includes('.')) {
        normalizedDomain = `https://${normalizedDomain}.atlassian.net`;
      } else {
        normalizedDomain = `https://${normalizedDomain}`;
      }
    }

    const credentials = {
      ...formData,
      domain: normalizedDomain,
    };

    await login(credentials);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Jira Dashboard</h1>
          <p>Sign in with your Jira credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={validationErrors.email ? 'error' : ''}
              placeholder="your.email@company.com"
              disabled={isLoading}
            />
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="api_token">API Token</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="api_token"
                name="api_token"
                value={formData.api_token}
                onChange={handleInputChange}
                className={validationErrors.api_token ? 'error' : ''}
                placeholder="Your Jira API token"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {validationErrors.api_token && (
              <span className="error-text">{validationErrors.api_token}</span>
            )}
            <small className="help-text">
              <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer">
                Create an API token
              </a>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="domain">Jira Domain</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              className={validationErrors.domain ? 'error' : ''}
              placeholder="company.atlassian.net or just 'company'"
              disabled={isLoading}
            />
            {validationErrors.domain && (
              <span className="error-text">{validationErrors.domain}</span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              <span>❌ {error}</span>
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Need help? Check the{' '}
            <a href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/" target="_blank" rel="noopener noreferrer">
              API token guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
