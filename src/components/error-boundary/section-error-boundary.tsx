"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

type Props = {
  children: React.ReactNode
  /** Shown in the fallback heading */
  title?: string
  description?: string
}

type State = { hasError: boolean; error: Error | null }

export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[SectionErrorBoundary]", error, info.componentStack)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const title = this.props.title ?? "This section had a problem"
      return (
        <div
          className="rounded-xl border border-border bg-surface/80 p-6 text-center shadow-card backdrop-blur-sm"
          role="alert"
        >
          <h2 className="font-heading text-lg text-heading">{title}</h2>
          <p className="mt-2 text-sm text-text-muted">
            {this.props.description ??
              "Something went wrong while rendering this part of the page. The rest of the app should still work."}
          </p>
          {process.env.NODE_ENV === "development" ? (
            <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-bg-muted p-3 text-left font-mono text-xs text-text-muted">
              {this.state.error.message}
            </pre>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
