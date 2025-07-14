import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const userNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Verification',
    href: '/dashboard/verification',
    icon: 'badgeCheck',
    label: 'verification'
  },
  {
    title: 'Candidates',
    href: '/dashboard/candidates',
    icon: 'user',
    label: 'candidates'
  },
  {
    title: 'Vote',
    href: '/dashboard/vote',
    icon: 'post',
    label: 'vote'
  },
  {
    title: 'Results',
    href: '/dashboard/results',
    icon: 'result',
    label: 'results'
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: 'history',
    label: 'history'
  }
];

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Election',
    href: '/admin/election',
    icon: 'post',
    label: 'election'
  },
  {
    title: 'Candidates',
    href: '/admin/candidates',
    icon: 'user2',
    label: 'users'
  },
  {
    title: 'Results',
    href: '/admin/results',
    icon: 'result',
    label: 'results'
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: 'user',
    label: 'users'
  }
];

export const votingSteps = [
  {
    title: "Registration & Sign In",
    description: "Before you can vote, you need to register and sign in to your account.",
    steps: [
      {
        title: "Create an account",
        description: "Sign up with your email address and create a secure password.",
        image: "https://i.imgur.com/qZmeZT4.gif",
        tips: "Use a strong password, and remember the password."
      },
      {
        title: "Login to your account",
        description: "After creating account, switch to tab Login. And Login with your credentials. The next step is creating wallet for voting process.",
        image: "https://i.imgur.com/tX6iYqu.gif",
        tips: "Save info if needed."
      },
      // {
      //   title: "Verify your identity",
      //   description: "Contact admin if for verification.",
      //   image: "/placeholder",
      //   tips: "Make sure to contact the admin for verification process."
      // },
      // {
      //   title: "Complete registration",
      //   description: "Congratulations you're successfully creating your account. The next step is creating wallet for voting process.",
      //   image: "/",
      //   tips: "It will show the website. Click voter guide for the complete guide"
      // }
    ]
  },
  {
    title: "Creating Wallet",
    description: "Once registered, you can create Metamask wallet and connect to the blockchain network for voting process.",
    steps: [
      {
        title: "Install Metamask extension",
        description: "Install Metamask, and add it as extension on your web browser.",
        image: "https://i.imgur.com/JYHzoBm.png",
        tips: "Install it from chrome web store or official web page Metamask",
        link: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      },
      {
        title: "Create your very first wallet",
        description: "Create a new wallet, follow the instruction. You can secure your wallet later.",
        image: "https://i.imgur.com/Ku03wVD.gif",
        tips: "Remember carefully your password."
      },
      {
        title: "Pin Metamask extension",
        description: "Once you created your wallet, pin Metamask extension to ease your voting process.",
        image: "https://i.imgur.com/m2izzS8.png",
        tips: "Make sure you're pin the extension, the Metamask logo will appear on top bar of your web browser."
      },
      {
        title: "Connect to Sepolia network",
        description: "Open Metamask and then go to the listed network (top left), show test networks and choose Sepolia network.",
        image: "https://i.imgur.com/01Bx1Xn.gif",
        tips: "Make sure you're choosing the right network, the Sepolia network."
      },
      {
        title: "Claim Sepolia faucet from Google Cloud Web 3",
        description: "This is required because the voting process require amount of Sepolia tokens on your wallet. Input your wallet address by copying from Metamask.",
        image: "https://i.imgur.com/Cu9vfQg.gif",
        tips: "Make sure you're already login to your google account",
        link: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
      },
      {
        title: "Check your balance",
        description: "Check your balance. It should be 0.05 SepoliaETH, then you're ready to vote.",
        image: "https://i.imgur.com/3tUHzYE.png",
        tips: "Make sure the balance amount is 0.05 SepoliaETH"
      }
    ]
  },
  {
    title: "Casting Your Vote",
    description: "Follow these steps to cast your vote successfully.",
    steps: [
      {
        title: "Review candidates",
        description: "Take your time to review all candidates and their information.",
        image: "https://i.imgur.com/G7NikoZ.gif",
        tips: "Click on each candidate to view their detailed profile.",
        link: "/dashboard/candidates"
      },
      {
        title: "Go to Vote page and Submit your vote",
        description: "Click vote on your preferred candidate. And click confirm ",
        image: "https://i.imgur.com/jc8yzrR.gif",
        tips: "You can change your selection before submitting your final vote, by clicking cancel.",
        link: "/dashboard/vote"
      },
      {
        title: "Connect your Metamask wallet to the website.",
        description: "Metamask window will appear. Enter your Metamask password if needed. And click connect.",
        image: "https://i.imgur.com/imJZ7Y3.png",
        tips: "This is your last chance to change your vote before final submission."
      },
      {
        title: "Submit your vote ",
        description: "Transaction window will appear, review all the request. Then Click the 'Confirm' button to cast your vote and your transaction. The transaction will use the sepolia token that you had claim before.",
        image: "https://i.imgur.com/cqnXZC1.png",
        tips: "Once you click confirm, your vote cannot be changed or revoked."
      }
    ]
  },
  {
    title: "After Voting",
    description: "What happens after you've cast your vote.",
    steps: [
      {
        title: "Confirmation receipt",
        description: "You'll receive a digital receipt confirming your vote was recorded. You also can check it on sepolia block explorer.",
        image: "https://i.imgur.com/Tj6gIff.gif",
        tips: "Save the transaction id as proof of your participation."
      },
      {
        title: "Track election results",
        description: "Visit the Results page to track the election in real-time.",
        image: "https://i.imgur.com/sRCvEjX.png",
        tips: "Results are updated in real-time but are not final until the election closes.",
        link: "/dashboard/results"
      }
    ]
  }
]

export const faqs = [
  {
    question: "What if I make a mistake while voting?",
    answer: "You can change your selection at any time before submitting your final vote. Once you've submitted your vote, it cannot be changed."
  },
  {
    question: "Is my vote anonymous?",
    answer: "Yes, your vote is completely anonymous. While the system records that you have voted, it does not link your identity to your specific vote choice."
  },
  {
    question: "What if I experience technical issues?",
    answer: "If you encounter any technical issues, please contact our support team immediately through the Help page or by calling our support hotline at (555) 123-4567."
  },
  {
    question: "Can I vote from my mobile device?",
    answer: "Yes, our e-voting system is fully compatible with smartphones and tablets. You can vote from any device with an internet connection."
  },
  {
    question: "How do I know my vote was counted?",
    answer: "After submitting your vote, you'll receive a confirmation receipt with a unique code. This confirms that your vote was successfully recorded in the system."
  }
]