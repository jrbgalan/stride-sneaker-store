"use client";

import React, { createContext, useContext, useEffect, useMemo, Suspense } from "react";
import NextLink from "next/link";
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from "next/navigation";

// Context for outlet/nested route passing
const OutletContext = createContext(null);

/**
 * Universal Link supporting both 'to' and 'href' props
 */
export const Link = React.forwardRef(function Link(
  { to, href, children, className, onClick, ...props },
  ref
) {
  const destination = to || href || "/";
  return (
    <NextLink
      ref={ref}
      href={destination}
      className={typeof className === "function" ? className({ isActive: false }) : className}
      onClick={onClick}
      {...props}
    >
      {children}
    </NextLink>
  );
});

/**
 * NavLink supporting active styling
 */
export const NavLink = React.forwardRef(function NavLink(
  { to, href, children, className, end, onClick, ...props },
  ref
) {
  const destination = to || href || "/";
  let pathname = "";
  try {
    pathname = useNextPathname() || "";
  } catch {
    pathname = "";
  }

  const isActive = end
    ? pathname === destination
    : pathname.startsWith(destination) && (destination !== "/" || pathname === "/");

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink
      ref={ref}
      href={destination}
      className={resolvedClassName}
      onClick={onClick}
      {...props}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </NextLink>
  );
});

/**
 * useNavigate hook wrapping Next.js router
 */
export function useNavigate() {
  const router = useNextRouter();

  return React.useCallback(
    (to, options = {}) => {
      if (typeof to === "number") {
        if (to < 0) router.back();
        else router.forward();
        return;
      }
      if (options.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );
}

/**
 * useLocation hook returning pathname, search, hash
 */
export function useLocation() {
  const pathname = useNextPathname() || "/";
  let search = "";
  try {
    const sp = useNextSearchParams();
    search = sp ? (sp.toString() ? `?${sp.toString()}` : "") : "";
  } catch {
    if (typeof window !== "undefined") {
      search = window.location.search || "";
    }
  }

  return useMemo(
    () => ({
      pathname,
      search,
      hash: typeof window !== "undefined" ? window.location.hash : "",
      state: null,
      key: "default",
    }),
    [pathname, search]
  );
}

/**
 * useParams hook wrapping Next.js useParams
 */
export function useParams() {
  try {
    const params = useNextParams();
    return params || {};
  } catch {
    return {};
  }
}

/**
 * useSearchParams hook compatible with react-router-dom
 * @param {any} [defaultInit]
 * @returns {[URLSearchParams, (nextInit: any, navigateOptions?: { replace?: boolean }) => void]}
 */
export function useSearchParams(defaultInit) {
  const router = useNextRouter();
  const pathname = useNextPathname();
  let nextParams = null;
  try {
    nextParams = useNextSearchParams();
  } catch {}

  const searchParams = useMemo(() => {
    if (nextParams) return nextParams;
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams(defaultInit || "");
  }, [nextParams, defaultInit]);

  const setSearchParams = React.useCallback(
    (nextInit, navigateOptions = {}) => {
      let sp;
      if (typeof nextInit === "function") {
        sp = new URLSearchParams(nextInit(searchParams));
      } else {
        sp = new URLSearchParams(nextInit);
      }
      const qs = sp.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (navigateOptions.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, pathname, searchParams]
  );

  return [searchParams, setSearchParams];
}

/**
 * Navigate component for declarative redirects
 */
export function Navigate({ to, replace = false }) {
  const router = useNextRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
}

/**
 * Outlet and routing structural stubs
 */
export function Outlet({ context }) {
  const outletChildren = useContext(OutletContext);
  return outletChildren || null;
}

export function useOutletContext() {
  return useContext(OutletContext);
}

export function BrowserRouter({ children }) {
  return <>{children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Route({ element, children }) {
  return element || children || null;
}

export default {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  Outlet,
  useOutletContext,
  BrowserRouter,
  Routes,
  Route,
};
