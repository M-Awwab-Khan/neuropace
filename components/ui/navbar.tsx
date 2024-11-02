'use client'
import { useState } from "react"
import { Brain, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"
import { SignUpButton } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { SignedIn } from "@clerk/nextjs"
import { SignedOut } from "@clerk/nextjs"
import Link from 'next/link'


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#" className="flex-shrink-0">
                            <Link href='/'>
                                <div className="flex items-center">
                                    <Brain className="h-8 w-8 text-primary" />
                                    <span className="ml-2 text-xl font-bold text-primary">NeuroPace</span>
                                </div>
                            </Link>
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <SignedOut>
                                <SignInButton />
                                <SignUpButton />
                            </SignedOut>
                            <div className="flex flex-row space-x-5">
                                <SignedIn>
                                    <Link href="/my-decks">
                                        <Button>My Decks</Button>
                                    </Link>
                                </SignedIn>
                                <UserButton />
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Button variant="ghost" className="w-full justify-start">Login</Button>
                        <Button variant="ghost" className="w-full justify-start">Sign Up</Button>
                        <Button className="w-full justify-start">My Decks</Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
