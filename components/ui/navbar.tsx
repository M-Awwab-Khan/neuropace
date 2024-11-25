"use client";
import { useState } from "react";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

//export default function Navbar() {
// const [isMenuOpen, setIsMenuOpen] = useState(false);
//
//   return (
//     <nav className="top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/">
//               <div className="flex items-center">
//                 <Brain className="h-8 w-8 text-primary" />
//                 <span className="ml-2 text-xl font-bold text-primary">
//                   NeuroPace
//                 </span>
//               </div>
//             </Link>
//           </div>
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               <SignedOut>
//                 <SignInButton mode="modal">
//                   <Button
//                     variant="outline"
//                     className="w-full min-[400px]:w-auto"
//                   >
//                     Login
//                   </Button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <Button
//                     variant="outline"
//                     className="w-full min-[400px]:w-auto bg-primary text-background"
//                   >
//                     Sign Up
//                   </Button>
//                 </SignUpButton>
//               </SignedOut>
//               <div className="flex flex-row space-x-5">
//                 <SignedIn>
//                   <Link href="/my-decks">
//                     <Button>My Decks</Button>
//                   </Link>
//                 </SignedIn>
//                 <UserButton />
//               </div>
//             </div>
//           </div>
//           <div className="md:hidden">
//             <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               <Menu className="h-6 w-6" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <SignedOut>
//               <SignInButton mode="modal">
//                 <Button variant="outline" className="w-full text-left">
//                   Login
//                 </Button>
//               </SignInButton>
//               <SignUpButton mode="modal">
//                 <Button variant="outline" className="w-full text-left">
//                   Sign Up
//                 </Button>
//               </SignUpButton>
//             </SignedOut>
//             <Link href="my-decks">
//               <Button className="w-full justify-start">My Decks</Button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

const NavItem = ({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) => {
  const isActive = usePathname() === href;

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "relative block px-3 py-2 transition",
          isActive ? "text-primary" : "hover:text-primary"
        )}
      >
        {children}
      </Link>
    </li>
  );
};

export const DesktopNavigation = (
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
) => {
  return (
    <nav {...props} className="max-w-8xl min-w-[50vw] ">
      <ul className="flex justify-between items-center rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10  hover:scale-110 transition hover:text-black">
        <NavItem href="/">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-primary hover:scale-150 hover:text-black" />
            <span className="ml-2 text-lg font-bold text-primary">
              NeuroPace
            </span>
          </div>
        </NavItem>
        <div className="flex justify-items-center justify-center items-center">
          <NavItem href="/">Home</NavItem>

          <SignedOut>
            <NavItem href="#">
              <SignInButton mode="modal" />
            </NavItem>
            <NavItem href="#">
              <SignUpButton mode="modal" />
            </NavItem>
          </SignedOut>
          <SignedIn>
            <NavItem href="/public-decks">Explore</NavItem>
            <NavItem href="/my-decks">My Decks</NavItem>
            <NavItem href="/quiz">Quiz</NavItem>
            <NavItem href="#">
              <UserButton />
            </NavItem>
          </SignedIn>
        </div>
      </ul>
    </nav>
  );
};
