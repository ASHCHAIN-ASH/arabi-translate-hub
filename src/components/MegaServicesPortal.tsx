import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

type Item = {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  description?: string;
};

interface MegaServicesPortalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  headerHeight: number;
  items: Item[];
}

const MegaServicesPortal: React.FC<MegaServicesPortalProps> = ({
  isOpen,
  onClose,
  isMobile,
  headerHeight,
  items,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const container = useMemo(() => document.body, []);

  // Lock body scroll and set header bottom var
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.setProperty("--header-bottom", `${headerHeight}px`);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, headerHeight]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      "a, button, [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Swipe to close on mobile
  useEffect(() => {
    if (!isMobile || !isOpen || !menuRef.current) return;
    let startX: number | null = null;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onMove = (e: TouchEvent) => {
      if (startX == null) return;
      const delta = startX - e.touches[0].clientX; // RTL: swipe right => negative
      if (delta < -60) onClose();
    };
    const onEnd = () => {
      startX = null;
    };

    const node = menuRef.current;
    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchmove", onMove, { passive: true });
    node.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      node.removeEventListener("touchstart", onStart as any);
      node.removeEventListener("touchmove", onMove as any);
      node.removeEventListener("touchend", onEnd as any);
    };
  }, [isMobile, isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        id="megaOverlay"
        ref={overlayRef}
        className={`mega-overlay ${isOpen ? "open" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />

      <nav
        id="megaServices"
        dir="rtl"
        aria-label="قائمة خدماتنا"
        role="menu"
        ref={menuRef}
        className={isOpen ? "open" : ""}
        style={!isMobile ? ({ top: `var(--header-bottom, ${headerHeight}px)` } as React.CSSProperties) : undefined}
      >
        {isMobile && (
          <div className="sticky top-0 bg-white border-b p-3 flex items-center justify-between z-10">
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg" aria-label="إغلاق القائمة">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-base text-primary">خدماتنا</h3>
          </div>
        )}

        <div className="grid">
          {items.map((service) => (
            <Link key={service.name} to={service.href} role="menuitem" className="mega-item" onClick={onClose}>
              <span className="icon" aria-hidden>
                <service.icon size={22} />
              </span>
              <span>{service.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>,
    container
  );
};

export default MegaServicesPortal;
