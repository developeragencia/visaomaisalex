import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatCurrency(value: number): string {
  // Os valores no banco estão em centavos, então dividimos por 100
  const realValue = value / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(realValue);
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getUserTypeFromEmail(email: string): 'client' | 'franchisee' | 'admin' {
  if (email.includes('admin')) return 'admin';
  if (email.includes('franqueado')) return 'franchisee';
  return 'client';
}

export function getDashboardByUserType(userType: 'client' | 'franchisee' | 'admin'): string {
  switch (userType) {
    case 'admin':
      return '/admin/dashboard';
    case 'franchisee':
      return '/franchisee/dashboard';
    case 'client':
    default:
      return '/client/dashboard';
  }
}

export function formatPhone(phone: string): string {
  // Remove non-numeric characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

export function formatCPF(cpf: string): string {
  // Remove non-numeric characters
  const cleaned = ('' + cpf).replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  
  return cpf;
}
