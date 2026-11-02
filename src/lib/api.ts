import { IStudio, IBooking, IUser, StudioCategory } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fast client-side SWR memory cache
const clientCache = new Map<string, { data: any; expiry: number }>();
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function clearClientCache(): void {
  clientCache.clear();
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const isGet = !options.method || options.method === "GET";

  // Instant response from client memory cache for GET requests
  if (isGet && !options.headers?.hasOwnProperty("Cache-Control")) {
    const cached = clientCache.get(url);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Required for HTTPOnly cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  if (isGet) {
    clientCache.set(url, { data, expiry: Date.now() + CLIENT_CACHE_TTL_MS });
  } else {
    // Invalidate client cache on any mutation (POST/PUT/PATCH/DELETE)
    clientCache.clear();
  }

  return data as T;
}

// Auth API
export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetcher<{ success: boolean; user: IUser; message: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    register: (userData: { name: string; email: string; password: string; photoURL?: string }) =>
      fetcher<{ success: boolean; message: string; userId: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    googleAuth: (googleUser: { name: string; email: string; photoURL?: string }) =>
      fetcher<{ success: boolean; user: IUser; message: string }>("/auth/google", {
        method: "POST",
        body: JSON.stringify(googleUser),
      }),

    getMe: () =>
      fetcher<{ success: boolean; user: IUser }>("/auth/me"),

    logout: () =>
      fetcher<{ success: boolean; message: string }>("/auth/logout", {
        method: "POST",
      }),
  },

  studios: {
    getAll: (params?: { category?: string; search?: string; sort?: string; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== "All") query.append("category", params.category);
      if (params?.search) query.append("search", params.search);
      if (params?.sort) query.append("sort", params.sort);
      if (params?.limit) query.append("limit", params.limit.toString());
      const qs = query.toString();
      return fetcher<{ success: boolean; count: number; studios: IStudio[] }>(
        `/studios${qs ? `?${qs}` : ""}`
      );
    },

    getById: (id: string) =>
      fetcher<{ success: boolean; studio: IStudio }>(`/studios/${id}`),

    create: (studioData: Partial<IStudio>) =>
      fetcher<{ success: boolean; studio: IStudio; message: string }>("/studios", {
        method: "POST",
        body: JSON.stringify(studioData),
      }),

    update: (id: string, studioData: Partial<IStudio>) =>
      fetcher<{ success: boolean; studio: IStudio; message: string }>(`/studios/${id}`, {
        method: "PUT",
        body: JSON.stringify(studioData),
      }),

    delete: (id: string) =>
      fetcher<{ success: boolean; message: string }>(`/studios/${id}`, {
        method: "DELETE",
      }),

    getMyListings: () =>
      fetcher<{ success: boolean; count: number; studios: IStudio[] }>("/studios/my-listings"),
  },

  bookings: {
    create: (bookingData: {
      studioId: string;
      bookingDate: string;
      startTime: string;
      endTime: string;
      notes?: string;
    }) =>
      fetcher<{ success: boolean; booking: IBooking; message: string }>("/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      }),

    getMyBookings: () =>
      fetcher<{ success: boolean; count: number; bookings: IBooking[] }>("/bookings/my-bookings"),

    cancel: (id: string) =>
      fetcher<{ success: boolean; message: string }>(`/bookings/${id}/cancel`, {
        method: "PATCH",
      }),

    getStudioSlots: (studioId: string) =>
      fetcher<{ success: boolean; bookings: { _id: string; bookingDate: string; startTime: string; endTime: string; status: string }[] }>(
        `/bookings/studio/${studioId}`
      ),
  },

  wishlist: {
    get: () =>
      fetcher<{ success: boolean; count: number; studioIds: string[]; studios: IStudio[] }>("/wishlist"),

    toggle: (studioId: string) =>
      fetcher<{ success: boolean; action: "added" | "removed"; message: string }>("/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ studioId }),
      }),
  },
};

