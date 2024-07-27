"use client";

import { signOut, useSession } from "next-auth/react";
import { DrawerComponent } from "../drawer";
import { usePathname, useRouter } from "next/navigation";
import { SkeletonComponent } from "../skeleton";
import { ProfileDropdownComponent } from "../dropdown/profileDropdown";
import { useEffect, useState } from "react";

export const NavbarComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // pathname to array
  const pathArray = pathname.split("/");
  // remove "" from array
  pathArray.shift();

  console.log("array path", pathArray.length);

  let activePath: string;
  // get the last item in the array
  if (pathArray.length > 2) {
    activePath = pathArray[1];
  } else {
    activePath = pathArray[pathArray.length - 1];
    // if active page like this /dashboard/test-blasting remove dash and replace with space
    activePath = activePath.replace("-", " ");
  }

  const name = session?.user?.name ?? "";
  const initial = name.slice(0, 2);

  const logout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      router.push("/");
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred:", error);
    }
  };

  const onScrollNavbar = () => {
    const navbar = document.querySelector("nav");

    if (window.scrollY > 10) {
      navbar?.classList.add("bg-white");
    } else {
      navbar?.classList.remove("bg-white");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScrollNavbar);

    return () => {
      window.removeEventListener("scroll", onScrollNavbar);
    };
  }, []);

  return (
    <nav className="border-b-[1px] border-slate-200 transition duration-200 ease-in px-6">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center justify-between gap-3">
          <DrawerComponent />
          <h1 className="text-slate-900 uppercase font-semibold text-lg lg:text-2xl">
            {pathArray.length > 3 ? activePath : activePath.replace("-", " ")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-900">
            {status === "loading" ? <SkeletonComponent /> : name}
          </span>
          {status === "loading" ? (
            <div className="skeleton h-9 w-9 shrink-0 rounded-full bg-slate-600"></div>
          ) : (
            <ProfileDropdownComponent initial={initial}>
              <li>
                <button
                  onClick={() => logout()}
                  className={`focus:text-slate-100 ${
                    isLoading ? "cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ProfileDropdownComponent>
          )}
        </div>
      </div>
    </nav>
  );
};
