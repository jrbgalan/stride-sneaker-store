import { useCallback } from "react";
import { useCartStore } from "@/lib/stores/cartStore";

export function useFlyToCart() {
  return useCallback((imageUrl, sourceEl, options = {}) => {
    if (typeof window === "undefined" || !sourceEl || !imageUrl) return;

    const { autoOpenMiniCart = true } = options;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Detect appropriate cart target (bottom-nav on mobile, header on desktop)
    const targets = Array.from(document.querySelectorAll("[data-cart-target]"));
    if (targets.length === 0) return;

    const isMobile = window.innerWidth < 1024;
    let target = targets[0];

    if (isMobile) {
      // Find the target located in the bottom nav (bottom half of screen)
      const bottomTarget = targets.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top > window.innerHeight / 2 && r.width > 0 && r.height > 0;
      });
      if (bottomTarget) target = bottomTarget;
    } else {
      // Find the target located in the top header
      const topTarget = targets.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 120 && r.width > 0 && r.height > 0;
      });
      if (topTarget) target = topTarget;
    }

    const triggerBadgeBounce = () => {
      const badges = document.querySelectorAll("[data-cart-badge]");
      badges.forEach((b) => {
        b.classList.remove("animate-cart-bounce");
        // Force reflow
        void b.offsetWidth;
        b.classList.add("animate-cart-bounce");
      });
      if (autoOpenMiniCart) {
        setTimeout(() => {
          useCartStore.getState().setMiniCartOpen(true);
        }, 120);
      }
    };

    if (prefersReducedMotion) {
      triggerBadgeBounce();
      return;
    }

    const fromRect = sourceEl.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2;
    const endY = toRect.top + toRect.height / 2;

    // Curved control point for arc trajectory
    const controlX = (startX + endX) / 2 + (isMobile ? 30 : -40);
    const controlY = Math.min(startY, endY) - (isMobile ? 40 : 100);

    const fly = document.createElement("img");
    fly.src = imageUrl;
    fly.alt = "Adding to cart";
    const initialSize = 80;
    const finalSize = 24;

    fly.style.position = "fixed";
    fly.style.zIndex = "99999";
    fly.style.width = `${initialSize}px`;
    fly.style.height = `${initialSize}px`;
    fly.style.objectFit = "contain";
    fly.style.pointerEvents = "none";
    fly.style.borderRadius = "9999px";
    fly.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
    fly.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    fly.style.padding = "6px";
    fly.style.left = "0px";
    fly.style.top = "0px";
    fly.style.transform = `translate3d(${startX - initialSize / 2}px, ${startY - initialSize / 2}px, 0)`;

    document.body.appendChild(fly);

    const duration = 480; // < 600ms
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out quadratic curve parameter
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Quadratic Bezier curve formula
      const oneMinusT = 1 - ease;
      const currentX =
        oneMinusT * oneMinusT * startX +
        2 * oneMinusT * ease * controlX +
        ease * ease * endX;
      const currentY =
        oneMinusT * oneMinusT * startY +
        2 * oneMinusT * ease * controlY +
        ease * ease * endY;

      const currentSize = initialSize - (initialSize - finalSize) * ease;
      const opacity = progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1;

      fly.style.width = `${currentSize}px`;
      fly.style.height = `${currentSize}px`;
      fly.style.opacity = `${opacity}`;
      fly.style.transform = `translate3d(${currentX - currentSize / 2}px, ${currentY - currentSize / 2}px, 0) scale(${1 - 0.4 * ease})`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        fly.remove();
        triggerBadgeBounce();
      }
    }

    requestAnimationFrame(animate);
  }, []);
}