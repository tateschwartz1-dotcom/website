'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';
import { projects, Project } from '@/lib/projects';

const notebookImages = [
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_1.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_2.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_3.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_4.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_5.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_6.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_7.jpg',
  '/projects/1775704444541-2fbacafc-92e5-43f4-b670-4cf6e5be38ad_9.jpg',
];

function renderExpandedContent(project: Project, onImageClick?: (index: number) => void) {
  if (project.id === 'guess-my-story') {
    return (
      <div className="font-pixel text-sm text-charcoal/90 leading-loose">
        <p>
          Learn all about me by playing a quick game. Click{' '}
          <a
            href="/guess-my-story"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            here
          </a>
          .
        </p>
      </div>
    );
  }

  if (project.id === 'classified') {
    return (
      <div className="font-pixel text-sm text-charcoal/90 leading-loose">
        <p className="mb-4">
          I&apos;m working on some new exciting projects now. I can&apos;t share the details… but here are some sneak peaks.
        </p>
        <p className="mb-2">
          <a href="https://www.mascotgo.com/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            MascotGO
          </a>: How do you get someone to stay on your app?
        </p>
        <p className="mb-4">
          <a href="https://www.degy.com/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            Degy Entertainment
          </a>: How can you design programs to help small artists?
        </p>
        <p>
          (To see more of my serious business, such as my work experience, check out my{' '}
          <a href="https://www.linkedin.com/in/tateschwartz" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            LinkedIn
          </a>.)
        </p>
      </div>
    );
  }

  if (project.id === 'el-summer-games') {
    return (
      <div className="font-pixel text-sm text-charcoal/90 leading-loose">
        <p className="mb-4">
          I hosted a month-long online competition where people would compete in unusual games for points. With over 50 players, it was a great success and very entertaining to judge.
        </p>
        <p>
          A link to the Instagram account is{' '}
          <a href="https://www.instagram.com/el.summer.games?igsh=MXRmbDFvNDY4MzRzYg==" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            here
          </a>. Note: After the competition, I passed the account on to someone else. I had nothing to do with the more recent Volume II.
        </p>
      </div>
    );
  }

  if (project.id === 'the-process') {
    return (
      <div className="font-pixel text-sm text-charcoal/90 leading-loose">
        <p className="mb-6">{project.description}</p>
        <div className="grid grid-cols-2 gap-3">
          {notebookImages.map((src, i) => (
            <button
              key={i}
              onClick={() => onImageClick?.(i)}
              className="rounded-xl overflow-hidden aspect-[3/4] cursor-pointer hover:opacity-90 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Notebook page ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (project.id === 'recruit-poster') {
    return (
      <div className="font-pixel text-sm text-charcoal/90 leading-loose">
        <p className="mb-4">{project.description}</p>
        <ul className="space-y-1">
          {project.bulletList?.map((item, index) => (
            <li key={index} className="flex">
              <span className="mr-3 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <p className="font-pixel text-sm text-charcoal/90 leading-loose whitespace-pre-line">
      {project.description}
      {project.link && project.linkText && (
        <a
          href={project.link}
          target={project.link.startsWith('/') ? '_self' : '_blank'}
          rel={project.link.startsWith('/') ? undefined : 'noopener noreferrer'}
          download={project.link.endsWith('.pdf') ? true : undefined}
          className="underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          {project.linkText}
        </a>
      )}
      {project.link && project.linkText && '.'}
    </p>
  );
}

export default function ProjectsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? Math.min(i + 1, notebookImages.length - 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const gameItem = {
    id: 'guess-my-story',
    title: 'Guess My Story',
    image: '/projects/guessmystory.png',
    rotation: -4,
    scale: 1,
    isGame: false,
  };

  const projectOrder = ['johnbox-games', 'classified', 'card-back', 'miel-wearline', 'el-summer-games', 'book-cover', 'the-process'];
  const orderedProjects = projectOrder
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ ...p!, isGame: false }));

  const allItems = [gameItem, ...orderedProjects];

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-10 lg:p-12 pb-20">
        <PageHeader title="Projects" />

        <div className="flex flex-col items-center mt-10">
          {allItems.map((item, index) => (
            <div
              key={item.id}
              className="relative w-full max-w-xs"
              style={{
                marginTop: index === 0 ? 0 : index === 1 ? -24 : index === 2 ? -52 : index === 3 ? -44 : index === 4 ? -30 : index === 5 ? -30 : index === 6 ? -35 : index === 7 ? -60 : index >= 5 ? -20 : -50,
                marginLeft: index === 5 ? 20 : undefined,
                zIndex: expandedId === item.id ? 100 : index === 2 ? allItems.length + 1 : index === 6 ? allItems.length : index === 7 ? allItems.length + 2 : allItems.length - index,
              }}
            >
              {/* Image — rotated */}
              {item.isGame ? (
                <Link
                  href="/guess-my-story"
                  className="relative block h-44 w-full group"
                  style={{ transform: `rotate(${item.rotation}deg) scale(${item.scale || 1})` }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-200"
                    sizes="320px"
                  />
                </Link>
              ) : (
                <button
                  onClick={() => toggle(item.id)}
                  className={`relative block w-full group cursor-pointer ${item.id === 'guess-my-story' ? 'h-32' : 'h-44'}`}
                  style={{ transform: `rotate(${item.rotation}deg) scale(${item.scale || 1})` }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-200"
                    sizes="320px"
                  />
                </button>
              )}

              {/* Description — not rotated, expands in flow */}
              {!item.isGame && (
                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white rounded-2xl p-6 mt-3 mb-2">
                        <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-3 font-semibold">
                          {item.title}
                        </h2>
                        {renderExpandedContent(item as Project, setLightboxIndex)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={() => setLightboxIndex(null)} />
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null)}
              disabled={lightboxIndex === 0}
              className="relative z-10 font-pixel text-2xl text-white px-4 py-2 disabled:opacity-20 hover:opacity-60 transition-opacity"
            >←</button>
            <motion.div
              key={lightboxIndex}
              className="relative z-10 max-h-[80vh] max-w-[80vw]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={notebookImages[lightboxIndex]}
                alt={`Notebook page ${lightboxIndex + 1}`}
                className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
              />
            </motion.div>
            <button
              onClick={() => setLightboxIndex(i => i !== null ? Math.min(i + 1, notebookImages.length - 1) : null)}
              disabled={lightboxIndex === notebookImages.length - 1}
              className="relative z-10 font-pixel text-2xl text-white px-4 py-2 disabled:opacity-20 hover:opacity-60 transition-opacity"
            >→</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
