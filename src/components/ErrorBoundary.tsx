import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    // You can also log the error to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Ocorreu um erro na aplicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <pre className="whitespace-pre-wrap text-sm text-red-700">{String(this.state.error?.message)}</pre>
              </div>
              <div className="mb-4">
                <details>
                  <summary className="cursor-pointer text-sm">Ver stack</summary>
                  <pre className="whitespace-pre-wrap text-xs mt-2">{this.state.info?.componentStack}</pre>
                </details>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()}>Recarregar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children as JSX.Element;
  }
}
