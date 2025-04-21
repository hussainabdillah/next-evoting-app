import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircuitBoardIcon,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  LayoutDashboardIcon,
  Loader2,
  LogIn,
  LucideIcon,
  LucideProps,
  LucideShoppingBag,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  UserCircle2Icon,
  UserPen,
  UserX2Icon,
  X,
  FileBadge
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  dashboard: LayoutDashboardIcon,
  logo: Command,
  login: LogIn,
  close: X,
  product: LucideShoppingBag,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  employee: UserX2Icon,
  post: FileText,
  page: File,
  userPen: UserPen,
  user2: UserCircle2Icon,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  result: FileBadge,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  twitter: Twitter,
  check: Check,
  metamask: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="metamask"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 319 319"
      {...props}
    >
      <path d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z" fill="#E2761B" stroke="#E2761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M44.4 35.5L143.1 110.1L125.6 65.8L44.4 35.5Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M238.3 206.8L211.8 247.4L268.5 263L284.8 207.7L238.3 206.8Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.9 207.7L50.1 263L106.8 247.4L80.3 206.8L33.9 207.7Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M103.6 138.2L87.8 162.1L144.1 164.6L142.1 104.1L103.6 138.2Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M214.9 138.2L175.9 103.4L174.6 164.6L230.8 162.1L214.9 138.2Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M106.8 247.4L140.6 230.9L111.4 208.1L106.8 247.4Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M177.9 230.9L211.8 247.4L207.1 208.1L177.9 230.9Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M211.8 247.4L177.9 230.9L180.6 253L180.3 262.3L211.8 247.4Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M106.8 247.4L138.3 262.3L138.1 253L140.6 230.9L106.8 247.4Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M138.8 193.5L110.6 185.2L130.5 176.1L138.8 193.5Z" fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M179.7 193.5L188 176.1L208 185.2L179.7 193.5Z" fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M106.8 247.4L111.6 206.8L80.3 207.7L106.8 247.4Z" fill="#CD6116" stroke="#CD6116" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M207 206.8L211.8 247.4L238.3 207.7L207 206.8Z" fill="#CD6116" stroke="#CD6116" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M230.8 162.1L174.6 164.6L179.8 193.5L188.1 176.1L208.1 185.2L230.8 162.1Z" fill="#CD6116" stroke="#CD6116" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M110.6 185.2L130.6 176.1L138.8 193.5L144.1 164.6L87.8 162.1L110.6 185.2Z" fill="#CD6116" stroke="#CD6116" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M87.8 162.1L111.4 208.1L110.6 185.2L87.8 162.1Z" fill="#E4751F" stroke="#E4751F" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M208.1 185.2L207.1 208.1L230.8 162.1L208.1 185.2Z" fill="#E4751F" stroke="#E4751F" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M144.1 164.6L138.8 193.5L145.4 227.6L146.9 182.7L144.1 164.6Z" fill="#E4751F" stroke="#E4751F" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M174.6 164.6L171.9 182.6L173.1 227.6L179.8 193.5L174.6 164.6Z" fill="#E4751F" stroke="#E4751F" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M179.8 193.5L173.1 227.6L177.9 230.9L207.1 208.1L208.1 185.2L179.8 193.5Z" fill="#F6851B" stroke="#F6851B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M110.6 185.2L111.4 208.1L140.6 230.9L145.4 227.6L138.8 193.5L110.6 185.2Z" fill="#F6851B" stroke="#F6851B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M180.3 262.3L180.6 253L178.1 250.8H140.4L138.1 253L138.3 262.3L106.8 247.4L117.8 256.4L140.1 271.9H178.4L200.8 256.4L211.8 247.4L180.3 262.3Z" fill="#C0AD9E" stroke="#C0AD9E" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M177.9 230.9L173.1 227.6H145.4L140.6 230.9L138.1 253L140.4 250.8H178.1L180.6 253L177.9 230.9Z" fill="#161616" stroke="#161616" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M278.3 114.2L286.8 73.4L274.1 35.5L177.9 106.9L214.9 138.2L267.2 153.5L278.8 140L273.8 136.4L281.8 129.1L275.6 124.3L283.6 118.2L278.3 114.2Z" fill="#763D16" stroke="#763D16" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.8 73.4L40.3 114.2L34.9 118.2L42.9 124.3L36.8 129.1L44.8 136.4L39.8 140L51.3 153.5L103.6 138.2L140.6 106.9L44.4 35.5L31.8 73.4Z" fill="#763D16" stroke="#763D16" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M267.2 153.5L214.9 138.2L230.8 162.1L207.1 208.1L238.3 207.7H284.8L267.2 153.5Z" fill="#F6851B" stroke="#F6851B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M103.6 138.2L51.3 153.5L33.9 207.7H80.3L111.4 208.1L87.8 162.1L103.6 138.2Z" fill="#F6851B" stroke="#F6851B" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M174.6 164.6L177.9 106.9L193.1 65.7998H125.6L140.6 106.9L144.1 164.6L145.3 182.8L145.4 227.6H173.1L173.3 182.8L174.6 164.6Z" fill="#F6851B" stroke="#F6851B" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  )
};
