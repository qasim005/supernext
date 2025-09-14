import { UserRole } from "./App";

export enum VoucherStatus {
  Active = 'Active',
  Pending = 'Pending',
  Expired = 'Expired',
  Suspended = 'Suspended',
  Archived = 'Archived'
}

export interface Voucher {
  id: string;
  code: string;
  status: VoucherStatus;
  validity: string;
  speedLimit: string;
  createdAt: Date;
  expiresAt: Date;
  batch?: string;
  deviceLimit?: number;
}

export enum UserStatus {
    Online = 'Online',
    Offline = 'Offline',
}

export interface User {
    id: string;
    username: string;
    macAddress: string;
    ipAddress: string;
    status: UserStatus;
    dataUsage: number; // in MB
    connectedSince: Date | null;
    lastSeen: Date;
}

// Types for Admin view of Client Users
export enum SubscriptionPlan {
    Professional = 'Professional',
    Starter = 'Starter',
    Enterprise = 'Enterprise',
    Trial = 'Trial',
}

export enum PaymentStatus {
    Active = 'Active',
    Overdue = 'Overdue',
    Canceled = 'Canceled',
    Trial = 'Trialing',
    Suspended = 'Suspended',
}

export interface ClientUser {
    id: string;
    name: string;
    email: string;
    subscriptionPlan: SubscriptionPlan;
    paymentStatus: PaymentStatus;
    nextDueDate: Date | null;
    accessEnabled: boolean;
}


// Types for User Access Management
export type SubUserRole = 'Admin' | 'Billing' | 'Read-only';

export interface SubUser {
    id: string;
    name: string;
    email: string;
    role: SubUserRole;
    status: 'Active' | 'Pending Invitation';
    lastLogin: Date | null;
}

export interface SubUserActivity {
    id:string;
    user: string;
    action: string;
    timestamp: Date;
}

// Types for Access Monitoring
export interface AccessLog {
    id: string;
    user: string;
    ipAddress: string;
    location: string;
    device: string;
    status: 'Success' | 'Failed';
    timestamp: Date;
}

// Types for Client Settings
export interface ClientProfile {
    companyName: string;
    logoUrl?: string;
    address: string;
    email: string;
    contactNumber: string;
    whatsappLink: string;
    timeZone: string;
    language: string;
}

export interface PaymentMethod {
    id: string;
    type: 'Visa' | 'MasterCard';
    last4: string;
    isDefault: boolean;
}

export interface Invoice {
    id: string;
    date: Date;
    amount: number;
    status: 'Paid' | 'Pending';
}

export interface BillingInfo {
    plan: string;
    renewalDate: Date;
    vouchersUsed: number;
    voucherLimit: number;
    paymentMethods: PaymentMethod[];
    invoices: Invoice[];
    autoRenewal: boolean;
}

// Types for Real-time Statistics
export interface BandwidthPoint {
    time: string;
    upload: number; // in Mbps
    download: number; // in Mbps
}

export interface DeviceDistribution {
    name: string;
    value: number;
    color: string;
}

// Types for Splash Page Customizer
export interface SplashPageSettings {
    logoUrl: string;
    welcomeTitle: string;
    welcomeMessage: string;
    backgroundType: 'color' | 'image';
    backgroundColor: string;
    backgroundImageUrl: string;
    primaryColor: string;
    textColor: string;
    loginOptions: {
        voucher: boolean;
        sms: boolean;
        socialGoogle: boolean;
        socialFacebook: boolean;
        socialInstagram: boolean;
        socialTikTok: boolean;
    };
    enableCryptoPayments: boolean;
    solanaAddress: string;
    bitcoinAddress: string;
    ethereumAddress: string;
    enableStripe: boolean;
    enableChatbot: boolean;
    whatsappNumber: string;
}

// Types for Notifications
export enum NotificationType {
  Voucher = 'voucher',
  Billing = 'billing',
  Security = 'security',
  Welcome = 'welcome',
  Support = 'support',
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Types for Service Management
export enum ServiceStatus {
    Running = 'Running',
    Degraded = 'Degraded',
    Stopped = 'Stopped',
}

export interface Service {
    id: string;
    name: string;
    status: ServiceStatus;
    uptime: number; // in seconds
    cpuUsage: number; // percentage
    memoryUsage: number; // in MB
    memoryTotal: number; // in MB
}

// Types for Admin Management
export type AdminRole = 'Full Access' | 'Support' | 'Read-only';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    lastLogin: Date;
}

// Types for Integrations
export interface IntegrationSettings {
    googleApiKey: string;
    emailGateway: 'none' | 'sendgrid' | 'mailgun';
    emailApiKey: string;
    emailFromAddress: string;
    smsGateway: 'none' | 'twilio' | 'atn0';
    smsSid: string;
    smsAuthToken: string;
    smsFromNumber: string;
    stripePublicKey: string;
    stripeSecretKey: string;
}

// Types for AI Copilot
export interface CopilotMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}
