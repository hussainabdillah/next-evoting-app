'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { connectWallet } from '@/utils/connectWallet';

export function UserNav() {
  const { data: session } = useSession();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      const { provider, signer, address } = await connectWallet();
      setWalletAddress(address);
      console.log('Wallet connected:', address);

      // Jika perlu, simpan provider dan signer ke context atau state global di sini
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleConnectWallet}>
            {walletAddress
                ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect Wallet'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
