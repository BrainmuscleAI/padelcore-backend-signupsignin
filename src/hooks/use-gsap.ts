import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return elementRef;
}

export function useGsapHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();

    tl.from('.hero-title', {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power4.out',
    })
      .from(
        '.hero-description',
        {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .from(
        '.hero-buttons',
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .from(
        '.hero-image',
        {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.5'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return containerRef;
}

export function useGsapCardAnimation() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return cardRef;
}