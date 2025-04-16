import React from "react";
import {ArrowRight, Check, ChevronsUpDown, Circle, Copy, Edit, ExternalLink, File, HelpCircle, Home, Loader2, Mail, MessageSquare, Moon, Plus, PlusCircle, Search, Server, Settings, Share2, Shield, Sun, Trash, User, X, Workflow} from 'lucide-react';

const Icons = {
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown,
  circle: Circle,
  workflow: Workflow,
  close: X,
  copy: Copy,
  dark: Moon,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  light: Sun,
  loader: Loader2,
  mail: Mail,
  messageSquare: MessageSquare,
  plus: Plus,
  plusCircle: PlusCircle,
  search: Search,
  server: Server,
  settings: Settings,
  share: Share2,
  shield: Shield,
  spinner: Loader2,
  trash: Trash,
  user: User,
};

export function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  >
  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
  <circle cx="9" cy="7" r="4" />
  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
);
}

export function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  >
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
);
}

export function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  >
  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
  <polyline points="14 2 14 8 20 8" />
  <line x1="16" x2="8" y1="13" y2="13" />
  <line x1="16" x2="8" y1="17" y2="17" />
  <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
);
}

export function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  >
  <line x1="12" x2="12" y1="20" y2="10" />
  <line x1="18" x2="18" y1="20" y2="4" />
  <line x1="6" x2="6" y1="20" y2="16" />
      </svg>
);
}

export {Icons};