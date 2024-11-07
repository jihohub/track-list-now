/* eslint-disable max-classes-per-file */
import { SeverityLevel } from "@sentry/nextjs";

export type ErrorSeverity = SeverityLevel;

export interface ErrorMetadata {
  severity: ErrorSeverity;
  errorCode?: string;
  componentStack?: string;
  statusCode?: number;
  timestamp: number;
  [key: string]: unknown;
}

export class AppError extends Error {
  metadata: ErrorMetadata;

  constructor(message: string, metadata: Partial<ErrorMetadata> = {}) {
    super(message);
    this.name = "AppError";
    this.metadata = {
      severity: metadata.severity || "error",
      errorCode: metadata.errorCode,
      componentStack: metadata.componentStack,
      statusCode: metadata.statusCode,
      timestamp: Date.now(),
    };
  }

  getStatusCode(): number {
    return this.metadata.statusCode || 500;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, {
      severity: "warning",
      errorCode: "VALIDATION_ERROR",
      statusCode: 400,
    });
    this.name = "ValidationError";
  }
}

export class APIError extends AppError {
  constructor(message: string, metadata: Partial<ErrorMetadata> = {}) {
    super(message, {
      severity: "error",
      errorCode: metadata.errorCode || "API_ERROR",
      statusCode: metadata.statusCode || 500,
      ...metadata,
    });
    this.name = "APIError";
  }
}

export class SpotifyAPIError extends APIError {
  constructor(
    message: string,
    statusCode?: number,
    additionalMetadata: Partial<ErrorMetadata> = {},
  ) {
    super(message, {
      severity: "error",
      errorCode: "SPOTIFY_API_ERROR",
      statusCode: statusCode || 503,
      service: "spotify",
      ...additionalMetadata,
    });
    this.name = "SpotifyAPIError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, {
      severity: "fatal",
      errorCode: "DATABASE_ERROR",
      statusCode: 500,
    });
    this.name = "DatabaseError";
  }
}
