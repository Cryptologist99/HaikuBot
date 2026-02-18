import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px', fontFamily: 'monospace', color: '#cc6666',
          background: '#0c0c0c', minHeight: '100vh'
        }}>
          <div style={{ color: '#666', marginBottom: 16, fontSize: 11, letterSpacing: 2 }}>
            ERROR
          </div>
          <pre style={{ fontSize: 13, whiteSpace: 'pre-wrap', color: '#cc6666' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ fontSize: 11, marginTop: 16, color: '#555', whiteSpace: 'pre-wrap' }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
