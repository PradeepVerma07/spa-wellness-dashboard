"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GsapEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cleanups: Array<() => void> = [];
    let context: gsap.Context | undefined;

    const timer = window.setTimeout(() => {
      context = gsap.context(() => {
        const heroItems = gsap.utils.toArray<HTMLElement>(".gsap-hero");
        if (heroItems.length) {
          gsap.from(heroItems, {
            y: 32,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
          });
        }

        gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
          gsap.from(element, {
            y: 34,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".stagger-group").forEach((group) => {
          const cards = group.querySelectorAll(".stagger-card");
          if (!cards.length) return;
          gsap.from(cards, {
            y: 26,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".parallax").forEach((element) => {
          gsap.to(element, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              scrub: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".magnetic").forEach((element) => {
          const move = (event: MouseEvent) => {
            const box = element.getBoundingClientRect();
            const x = event.clientX - box.left - box.width / 2;
            const y = event.clientY - box.top - box.height / 2;
            gsap.to(element, { x: x * 0.16, y: y * 0.16, duration: 0.28, ease: "power3.out" });
          };
          const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.38, ease: "elastic.out(1, 0.4)" });
          element.addEventListener("mousemove", move);
          element.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            element.removeEventListener("mousemove", move);
            element.removeEventListener("mouseleave", leave);
          });
        });

        gsap.utils.toArray<HTMLElement>(".gallery-zoom").forEach((element) => {
          const enter = () => gsap.to(element, { scale: 1.08, duration: 0.5, ease: "power3.out" });
          const leave = () => gsap.to(element, { scale: 1, duration: 0.6, ease: "power3.out" });
          element.addEventListener("mouseenter", enter);
          element.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            element.removeEventListener("mouseenter", enter);
            element.removeEventListener("mouseleave", leave);
          });
        });
      });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      cleanups.forEach((cleanup) => cleanup());
      context?.revert();
    };
  }, []);

  return null;
}
