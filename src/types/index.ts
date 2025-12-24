// src/types/index.ts

// Based on #/components/schemas/LoginInput
export interface LoginInput {
  email?: string;
  password?: string;
}


// Based on #/components/schemas/RegisterInput
export interface RegisterInput {
  customerName?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
}


// Define the structure of the API error response from your backend
interface ApiErrorData {
  message: string;
  statusCode: number;
  success: boolean;
}

// Define the structure of an Axios error containing our custom error data
export interface ApiError {
  response?: {
    data?: ApiErrorData;
  };
}

// Type guard to check if an error is an ApiError
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    // typeof (error as any).response?.data?.message === 'string'
    typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
  );
}


// Based on #/components/schemas/AgentInfo
export interface AgentInfo {
  _id: string;
  customerName: string;
  phone: string;

}

// Based on #/components/schemas/TrackingPoint
export interface TrackingPoint {
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

// Based on #/components/schemas/PublicTrackingInfo
export interface PublicTrackingInfo {
  parcelId: string;
  status: 'Booked' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed';
  assignedAgent?: AgentInfo; // Agent can be optional
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingPoint[];
}


export interface RegisterAdminInput extends RegisterInput {
  registerKey?: string;
}

// Add and export this new Parcel interface
export interface Parcel {
  _id: string;
  parcelId: string;
  sender: string; // This will be the user's ID string
  assignedAgent?: string; // Optional agent ID string
  pickupAddress: string;
  pickupExactLocation?: string; // Made optional
  pickupCoordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
  deliveryAddress?: string; // Made optional
  receiverName: string;
  receiverNumber: string;
  parcelType: string;
  parcelSize: 'small' | 'medium' | 'large';
  paymentType: 'COD' | 'prepaid';
  codAmount?: number;
  status: 'Booked' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed';
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  deliveryCoordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}


// Shape for one item in the daily bookings array
export interface AnalyticsDataPoint {
  _id: string; // This will be the date string
  count: number;
}

// Shape for one item in the status stats array
export interface StatusStat {
  _id: string; // This will be the status string
  totalCodAmount: number;
  count: number;
}

// The complete shape of the analytics data object
export interface AnalyticsData {
  dailyBookings: AnalyticsDataPoint[];
  statusStats: StatusStat[];
}

// This type matches the data from your booking form
export interface ParcelCreateInput {
  pickupAddress: string;
  pickupExactLocation?: string;
  pickupCoordinates?: {
    lat: number;
    lng: number;
  };
  deliveryAddress?: string;
  deliveryCoordinates?: {
    lat: number;
    lng: number;
  };
  receiverName: string;
  receiverNumber: string;
  parcelType: string;
  parcelSize: 'small' | 'medium' | 'large';
  paymentType: 'COD' | 'prepaid';
  codAmount?: number;
}