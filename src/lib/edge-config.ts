import { get } from "@vercel/edge-config";

export interface PersonalInfo {
  name: string;
  title: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
}

export async function getPersonalInfo(): Promise<PersonalInfo> {
  const [name, title, linkedin, github, youtube] = await Promise.all([
    get('name'),
    get('title'),
    get('linkedin'),
    get('github'),
    get('youtube'),
  ]);

  return {
    name: (name as string) || 'Your Name',
    title: (title as string) || 'Professional Title',
    linkedin: linkedin as string,
    github: github as string,
    youtube: youtube as string,
  };
}