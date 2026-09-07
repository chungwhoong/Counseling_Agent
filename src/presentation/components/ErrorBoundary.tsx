"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">오류가 발생했습니다</h2>
          <p className="text-slate-500 mb-6">
            {this.state.error?.message ?? "알 수 없는 오류가 발생했습니다."}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
            다시 시도
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
