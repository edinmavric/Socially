'use client';

import {
    BellIcon,
    HomeIcon,
    LogOutIcon,
    MenuIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { useAuth, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { getUnreadNotificationCount } from '@/actions/notification.action';

function MobileNavbar() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { isSignedIn } = useAuth();
    const { theme, setTheme } = useTheme();
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useUser();
    const profileLink = user
        ? `/profile/${
              user.username ??
              user.primaryEmailAddress?.emailAddress.split('@')[0]
          }`
        : '/profile';

    useEffect(() => {
        async function fetchUnreadCount() {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);
        }

        fetchUnreadCount();
    }, []);

    return (
        <div className="flex md:hidden items-center space-x-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mr-2"
            >
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMobileMenu(false)}
                    >
                        <div className="relative">
                            <MenuIcon className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-4 mt-6">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 justify-start"
                            asChild
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </Link>
                        </Button>

                        {isSignedIn ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 justify-start"
                                    asChild
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <Link href="/notifications">
                                        <div className="relative">
                                            <BellIcon className="w-4 h-4" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        Notifications
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 justify-start"
                                    onClick={() => setShowMobileMenu(false)}
                                    asChild
                                >
                                    <Link href={profileLink}>
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                </Button>
                                <SignOutButton>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-3 justify-start w-full"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </SignOutButton>
                            </>
                        ) : (
                            <SignInButton mode="modal">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileNavbar;
