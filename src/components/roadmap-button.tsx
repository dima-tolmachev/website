import Link from 'next/link';

export function RoadmapButton() {
  return (
    <Link
      href="/front-end-engineer-handbook"
      className="roadmap-button group relative inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-gray-900 bg-white rounded-lg cursor-pointer transform hover:scale-105 active:scale-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <span className="relative z-10">My Front-end Engineer Handbook • Free</span>
    </Link>
  );
}

