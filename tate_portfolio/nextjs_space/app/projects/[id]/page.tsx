import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';
import { projects } from '@/lib/projects';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  // Special rendering for Classified project with multiple links
  const renderClassifiedDescription = () => {
    if (project.id !== 'classified') return null;
    
    return (
      <div className="font-body text-base md:text-lg text-charcoal/90 leading-relaxed max-w-xl font-medium">
        <p className="mb-4">
          I&apos;m working on some new exciting projects now. I can&apos;t share the details… but here are some sneak peaks.
        </p>
        <p className="mb-2">
          <a
            href="https://www.mascotgo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            MascotGO
          </a>
          : How do you get someone to stay on your app?
        </p>
        <p className="mb-4">
          <a
            href="https://www.degy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Degy Entertainment
          </a>
          : How can you design programs to help small artists?
        </p>
        <p>
          (To see more of my serious business, such as my work experience, check out my{' '}
          <a
            href="https://www.linkedin.com/in/tateschwartz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            LinkedIn
          </a>
          .)
        </p>
      </div>
    );
  };

  // Special rendering for EL Summer Games with note
  const renderELSummerGamesDescription = () => {
    if (project.id !== 'el-summer-games') return null;
    
    return (
      <div className="font-body text-base md:text-lg text-charcoal/90 leading-relaxed max-w-xl font-medium">
        <p className="mb-4">
          I hosted a month-long online competition where people would compete in unusual games for points. With over 50 players, it was a great success and very entertaining to judge.
        </p>
        <p>
          A link to the Instagram account is{' '}
          <a
            href="https://www.instagram.com/el.summer.games?igsh=MXRmbDFvNDY4MzRzYg=="
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            here
          </a>
          . Note: After the competition, I passed the account on to someone else. I had nothing to do with the more recent Volume II.
        </p>
      </div>
    );
  };

  // Special rendering for Card Games with bullet list
  const renderCardGamesDescription = () => {
    if (project.id !== 'recruit-poster') return null;
    
    return (
      <div className="font-body text-base md:text-lg text-charcoal/90 leading-relaxed max-w-xl font-medium">
        <p className="mb-4">
          {project.description}
        </p>
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
  };

  // Default description rendering with optional link
  const renderDefaultDescription = () => {
    if (project.id === 'classified' || project.id === 'el-summer-games' || project.id === 'recruit-poster') return null;
    
    return (
      <p className="font-body text-base md:text-lg text-charcoal/90 leading-relaxed max-w-xl whitespace-pre-line font-medium">
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
  };

  return (
    <main className="relative min-h-screen overflow-auto">
      <AnimatedBackground />
      
      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        <PageHeader title="Projects" backHref="/projects" />
        
        {/* Project Detail Layout */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 lg:gap-16 mt-8">
          
          {/* Left Side - Large Image */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative aspect-square bg-white p-3 shadow-xl">
              <div className="relative w-full h-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Right Side - Project Info */}
          <div className="flex-1">
            <h2 className="font-body text-3xl md:text-4xl lg:text-5xl text-charcoal mb-6 font-semibold">
              {project.title}
            </h2>
            
            {renderClassifiedDescription()}
            {renderELSummerGamesDescription()}
            {renderCardGamesDescription()}
            {renderDefaultDescription()}
          </div>
          
        </div>
      </div>
    </main>
  );
}
