import Image from 'next/image';
import { getPersonalInfo } from '@/lib/edge-config';
import { SocialLinks } from '@/components/social-links';
import { ConsultationButton } from '@/components/consultation-button';
import { RoadmapButton } from '@/components/roadmap-button';

export default async function Home() {
  const personalInfo = await getPersonalInfo();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Image
              src="/images/profile.webp"
              alt={personalInfo.name}
              width={160}
              height={160}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
              {personalInfo.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-normal">
              {personalInfo.title}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <RoadmapButton />
            <ConsultationButton personalInfo={personalInfo} />
          </div>
          <SocialLinks personalInfo={personalInfo} />
        </div>
      </div>
    </div>
  );
}
