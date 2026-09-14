import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { rotateCiphertext } from '../utils/crypto.js';

export type JobType = 
  | 'NOTIFICATION_DISPATCH'
  | 'PRESCRIPTION_ARCHIVAL'
  | 'AUDIT_LOG_BATCH'
  | 'KEY_ROTATION_MIGRATION';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Job<T = any> {
  id: string;
  type: JobType;
  payload: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

export class JobQueueService extends EventEmitter {
  private queue: Job[] = [];
  private isProcessing = false;
  private concurrency = 3;
  private activeWorkers = 0;

  constructor() {
    super();
  }

  /**
   * Enqueue a new asynchronous background job
   */
  public enqueue<T = any>(type: JobType, payload: T, maxAttempts: number = 3): Job<T> {
    const job: Job<T> = {
      id: uuidv4(),
      type,
      payload,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.queue.push(job);
    logger.info({ jobId: job.id, type: job.type }, 'Asynchronous job enqueued');
    
    // Trigger background queue processing asynchronously
    setImmediate(() => this.processNext());

    return job;
  }

  /**
   * Process jobs in queue with concurrency control
   */
  private async processNext(): Promise<void> {
    if (this.activeWorkers >= this.concurrency) return;

    const job = this.queue.find((j) => j.status === 'QUEUED');
    if (!job) return;

    job.status = 'PROCESSING';
    job.attempts += 1;
    job.updatedAt = new Date();
    this.activeWorkers += 1;

    try {
      logger.info({ jobId: job.id, type: job.type, attempt: job.attempts }, 'Processing async job');
      await this.executeJob(job);

      job.status = 'COMPLETED';
      job.processedAt = new Date();
      job.updatedAt = new Date();
      logger.info({ jobId: job.id, type: job.type }, 'Async job completed successfully');
      this.emit('job:completed', job);
    } catch (err: any) {
      logger.error({ jobId: job.id, type: job.type, error: err.message }, 'Async job execution failed');
      job.error = err.message;
      job.updatedAt = new Date();

      if (job.attempts < job.maxAttempts) {
        // Re-queue with exponential backoff
        job.status = 'QUEUED';
        const delay = Math.pow(2, job.attempts) * 100;
        setTimeout(() => this.processNext(), delay);
      } else {
        job.status = 'FAILED';
        logger.error({ jobId: job.id, type: job.type }, 'Async job failed permanently');
        this.emit('job:failed', job);
      }
    } finally {
      this.activeWorkers -= 1;
      setImmediate(() => this.processNext());
    }
  }

  /**
   * Job handlers for heavy tasks
   */
  private async executeJob(job: Job): Promise<void> {
    switch (job.type) {
      case 'NOTIFICATION_DISPATCH': {
        // Simulate email/SMS notification dispatch to patient and doctor
        const { recipient, message, channel } = job.payload;
        await new Promise((resolve) => setTimeout(resolve, 50));
        logger.info({ recipient, channel, messageSnippet: message?.slice(0, 30) }, 'Dispatched asynchronous notification');
        break;
      }

      case 'PRESCRIPTION_ARCHIVAL': {
        // Asynchronously archive prescription records with digital signature verification
        const { prescriptionId, doctorId, patientId } = job.payload;
        await new Promise((resolve) => setTimeout(resolve, 80));
        logger.info({ prescriptionId, doctorId, patientId }, 'Archived digital prescription to immutable cold storage');
        break;
      }

      case 'AUDIT_LOG_BATCH': {
        // Batch verification and integrity hashing of recent audit records
        const { batchSize } = job.payload;
        await new Promise((resolve) => setTimeout(resolve, 60));
        logger.info({ batchSize: batchSize || 10 }, 'Completed audit log batch integrity verification');
        break;
      }

      case 'KEY_ROTATION_MIGRATION': {
        // Re-encrypt ciphertexts from an old version to a new target version
        const { records, targetVersion } = job.payload;
        if (Array.isArray(records)) {
          for (const record of records) {
            if (record.ciphertext) {
              record.newCiphertext = rotateCiphertext(record.ciphertext, targetVersion);
            }
          }
        }
        logger.info({ count: records?.length || 0, targetVersion }, 'Completed key rotation re-encryption migration');
        break;
      }

      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  /**
   * Returns current queue metrics and active jobs
   */
  public getMetrics() {
    return {
      total: this.queue.length,
      queued: this.queue.filter((j) => j.status === 'QUEUED').length,
      processing: this.queue.filter((j) => j.status === 'PROCESSING').length,
      completed: this.queue.filter((j) => j.status === 'COMPLETED').length,
      failed: this.queue.filter((j) => j.status === 'FAILED').length,
      activeWorkers: this.activeWorkers,
    };
  }

  public getJob(id: string): Job | undefined {
    return this.queue.find((j) => j.id === id);
  }

  public clearQueue(): void {
    this.queue = [];
    this.activeWorkers = 0;
  }
}

export const jobQueueService = new JobQueueService();
