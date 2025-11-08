// src/lib/apiClient.ts
export interface ApiError extends Error {
  status?: number;
  body?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function apiFetch(path: string, options: RequestInit = {}, token?: string) {
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  // Merge headers carefully. Only set JSON content-type if there's a body and no explicit header.
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.body && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errBody = null;
    try {
      errBody = await res.json();
    } catch (_) {
      // ignore
    }
    const err: ApiError = new Error(errBody?.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = errBody;
    throw err;
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}
