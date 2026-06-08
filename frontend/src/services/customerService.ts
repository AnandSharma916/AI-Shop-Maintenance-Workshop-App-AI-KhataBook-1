import { fetchApi } from './apiClient';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: string;
}

export interface CustomerProfile extends Customer {
  JobCards?: unknown[];
  Udhari?: unknown[];
  Documents?: unknown[];
}

export const customerService = {
  getAll: () => fetchApi('/api/customers'),
  
  getById: (id: string) => fetchApi(`/api/customers/${id}`),
  
  create: (data: { name: string; phone: string; address?: string }) => 
    fetchApi('/api/customers', { method: 'POST', data }),
    
  update: (id: string, data: { name: string; phone: string; address?: string }) => 
    fetchApi(`/api/customers/${id}`, { method: 'PUT', data }),
    
  delete: (id: string) => fetchApi(`/api/customers/${id}`, { method: 'DELETE' }),
  
  uploadDocument: (id: string, title: string, photoUrl: string | ArrayBuffer | null) => 
    fetchApi(`/api/customers/${id}/documents`, { 
      method: 'POST', 
      data: { title, photoUrl } 
    }),
    
  deleteDocument: (docId: string) => fetchApi(`/api/customers/documents/${docId}`, { method: 'DELETE' }),
};
