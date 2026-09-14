import { jobQueueService } from '../src/services/jobQueue.service.js';
import { encrypt, registerKey } from '../src/utils/crypto.js';

describe('Asynchronous Job Queue & Worker Service', () => {
  beforeEach(() => {
    jobQueueService.clearQueue();
  });

  it('should enqueue and execute an async notification job', (done) => {
    const job = jobQueueService.enqueue('NOTIFICATION_DISPATCH', {
      recipient: 'patient@amrutam.co',
      message: 'Your Ayurvedic consultation is scheduled.',
      channel: 'EMAIL',
    });

    expect(job.id).toBeDefined();
    expect(job.type).toBe('NOTIFICATION_DISPATCH');
    expect(job.status).toBe('QUEUED');

    jobQueueService.once('job:completed', (completedJob) => {
      expect(completedJob.id).toBe(job.id);
      expect(completedJob.status).toBe('COMPLETED');
      expect(completedJob.processedAt).toBeDefined();
      done();
    });
  });

  it('should execute key rotation migration job', (done) => {
    registerKey('v2', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789');

    const sampleText = 'Encrypted clinical record #991';
    const ciphertextV1 = encrypt(sampleText, 'v1');

    const records = [{ id: 'rec-1', ciphertext: ciphertextV1 }];

    const job = jobQueueService.enqueue('KEY_ROTATION_MIGRATION', {
      records,
      targetVersion: 'v2',
    });

    jobQueueService.once('job:completed', (completedJob) => {
      expect(completedJob.id).toBe(job.id);
      expect(records[0].newCiphertext).toBeDefined();
      expect(records[0].newCiphertext.startsWith('v2:')).toBe(true);
      done();
    });
  });

  it('should report queue metrics correctly', () => {
    jobQueueService.enqueue('AUDIT_LOG_BATCH', { batchSize: 50 });
    const metrics = jobQueueService.getMetrics();

    expect(metrics.total).toBeGreaterThanOrEqual(1);
    expect(typeof metrics.queued).toBe('number');
    expect(typeof metrics.completed).toBe('number');
  });
});
