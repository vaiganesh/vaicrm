/**
 * Utility functions for form data transformation and validation
 */

/**
 * Transforms comma-separated string to array and filters empty values
 */
export const parseCommaSeparatedString = (value: string | undefined): string[] => {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

/**
 * Transforms comma-separated string to array of numbers
 */
export const parseCommaSeparatedNumbers = (value: string | undefined): number[] => {
  if (!value) return [];
  return value
    .split(',')
    .map(item => parseInt(item.trim()))
    .filter(num => !isNaN(num));
};

/**
 * Safely gets nested object property with fallback
 */
export const safeGet = <T>(obj: any, path: string, fallback: T): T => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
  } catch {
    return fallback;
  }
};

/**
 * Transforms form data for API requests by removing undefined values
 */
export const cleanFormData = <T extends Record<string, any>>(data: T): Partial<T> => {
  const cleaned = {} as Partial<T>;
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof T] = value;
    }
  });
  
  return cleaned;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if array of emails are all valid
 */
export const validateEmailArray = (emails: string[]): boolean => {
  return emails.every(isValidEmail);
};

/**
 * Common form field validation helpers
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

/**
 * Debounced validation function for real-time form validation
 */
export const createDebouncedValidator = (
  validator: (value: any) => boolean,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (value: any): Promise<boolean> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(validator(value));
      }, delay);
    });
  };
};

/**
 * Type-safe form data transformer for incident management
 */
export interface IncidentFormData {
  title: string;
  affectedSystem: string;
  severity: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  impactedCustomers?: number;
  rootCause: string;
  resolutionSteps: string;
  status: string;
  assignedOwner: string;
  ownerTeam?: string;
  attachments?: string[];
  notificationSettings?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    stakeholders: string[];
  };
  linkedServiceTickets?: number[];
  stakeholderEmails?: string;
  linkedTicketIds?: string;
}

export const transformIncidentFormData = (data: IncidentFormData) => {
  return {
    title: data.title,
    affectedSystem: data.affectedSystem,
    severity: data.severity,
    description: data.description,
    startTime: data.startTime || new Date(),
    endTime: data.endTime,
    impactedCustomers: data.impactedCustomers,
    rootCause: data.rootCause,
    resolutionSteps: data.resolutionSteps,
    status: data.status,
    assignedOwner: data.assignedOwner,
    ownerTeam: data.ownerTeam,
    attachments: data.attachments || [],
    notificationSettings: {
      emailAlerts: data.notificationSettings?.emailAlerts ?? true,
      smsAlerts: data.notificationSettings?.smsAlerts ?? false,
      stakeholders: parseCommaSeparatedString(data.stakeholderEmails),
    },
    linkedServiceTickets: parseCommaSeparatedNumbers(data.linkedTicketIds),
  };
};