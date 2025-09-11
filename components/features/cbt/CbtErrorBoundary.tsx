import React from "react";

class CbtErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('CBT Module Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service
    if (this.props.onError && typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="container mt-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="card-title text-danger">Something went wrong</h4>
              <p className="card-text text-muted">
                There was an error in the CBT module. Please try again or contact support if the problem persists.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-start mt-3">
                  <summary className="text-danger cursor-pointer">Error Details (Development Only)</summary>
                  <pre className="mt-2 p-2 bg-light border rounded">
                    <code className="text-danger">
                      {this.state.error.toString()}
                    </code>
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 p-2 bg-light border rounded">
                      <code className="text-muted">
                        {this.state.errorInfo.componentStack}
                      </code>
                    </pre>
                  )}
                </details>
              )}
              
              <div className="mt-4">
                <button 
                  className="btn btn-primary me-2"
                  onClick={this.handleRetry}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Try Again
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Refresh Page
                </button>
              </div>
              
              <div className="mt-3">
                <small className="text-muted">
                  If this problem continues, please contact support with the error details above.
                </small>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default CbtErrorBoundary;
