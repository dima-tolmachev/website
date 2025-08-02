import { getPersonalInfo } from '@/lib/edge-config';
import { SocialLinks } from '@/components/social-links';

export default async function Home() {
  const personalInfo = await getPersonalInfo();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
              {personalInfo.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-normal">
              {personalInfo.title}
            </p>
          </div>
          <SocialLinks personalInfo={personalInfo} />
        </div>
      </div>
    </div>
  );
}
