import { pool, query } from './database/index.js';
import { redisClient, cacheGet, cacheSet, cacheDel } from './redis/index.js';
import { AuthService } from './services/auth.service.js';
import { DoctorService } from './services/doctor.service.js';
import { BookingService } from './services/booking.service.js';
import { ConsultationService } from './services/consultation.service.js';
import { PrescriptionService } from './services/prescription.service.js';
import { SearchService } from './services/search.service.js';
import { AuditService } from './services/audit.service.js';
import { AnalyticsService } from './services/analytics.service.js';
import { jobQueueService, JobQueueService } from './services/jobQueue.service.js';
import { signalingService } from './services/signaling.service.js';
import { storeService } from './services/store.service.js';
import { otpService, OtpService } from './services/otp.service.js';
import { smsService, SmsService } from './services/sms.service.js';

export interface ServiceContainer {
  db: {
    pool: typeof pool;
    query: typeof query;
  };
  cache: {
    client: typeof redisClient;
    get: typeof cacheGet;
    set: typeof cacheSet;
    del: typeof cacheDel;
  };
  authService: AuthService;
  doctorService: DoctorService;
  bookingService: BookingService;
  consultationService: ConsultationService;
  prescriptionService: PrescriptionService;
  searchService: SearchService;
  auditService: AuditService;
  analyticsService: AnalyticsService;
  jobQueueService: JobQueueService;
  signalingService: typeof signalingService;
  storeService: typeof storeService;
  otpService: OtpService;
  smsService: SmsService;
}

class Container {
  private services: Partial<ServiceContainer> = {};

  constructor() {
    this.initDefaultServices();
  }

  private initDefaultServices(): void {
    this.services = {
      db: { pool, query },
      cache: {
        client: redisClient,
        get: cacheGet,
        set: cacheSet,
        del: cacheDel,
      },
      authService: new AuthService(),
      doctorService: new DoctorService(),
      bookingService: new BookingService(),
      consultationService: new ConsultationService(),
      prescriptionService: new PrescriptionService(),
      searchService: new SearchService(),
      auditService: new AuditService(),
      analyticsService: new AnalyticsService(),
      jobQueueService,
      signalingService,
      storeService,
      otpService,
      smsService,
    };
  }

  /**
   * Register or override a service implementation (for dependency injection or testing)
   */
  public register<K extends keyof ServiceContainer>(key: K, instance: ServiceContainer[K]): void {
    this.services[key] = instance;
  }

  /**
   * Resolve a service instance from the container
   */
  public get<K extends keyof ServiceContainer>(key: K): ServiceContainer[K] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service '${String(key)}' is not registered in the DI Container`);
    }
    return service as ServiceContainer[K];
  }
}

export const container = new Container();
