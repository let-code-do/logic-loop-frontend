import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ViewType = 'dashboard' | 'flow' | 'variables' | 'hardware';

export interface NodeData {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  value?: any;
}

export interface Project {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  duration: string;
  lastRun: string;
}

export interface Variable {
  id: string;
  name: string;
  address: string;
  type: 'BIT' | 'WORD' | 'DWORD' | 'FLOAT' | 'TIMER';
  value: any;
  description: string;
}
