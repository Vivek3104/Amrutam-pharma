import { logger } from './logger.js';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  jitter?: boolean;
}

/**
 * Executes an async operation with exponential backoff and optional jitter.
 */
export async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 3000;
  const backoffFactor = options.backoffFactor ?? 2;
  const jitter = options.jitter ?? true;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) {
        logger.error({ attempt, maxRetries, error: err.message }, 'Operation failed after maximum retries');
        throw err;
      }

      let currentDelay = delay;
      if (jitter) {
        currentDelay = delay * (0.5 + Math.random());
      }
      currentDelay = Math.min(currentDelay, maxDelayMs);

      logger.warn(
        { attempt, maxRetries, delayMs: Math.round(currentDelay), error: err.message },
        'Retrying operation with exponential backoff'
      );

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      delay *= backoffFactor;
    }
  }

  throw new Error('Retries exhausted');
}
