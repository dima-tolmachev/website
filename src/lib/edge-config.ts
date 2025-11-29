import { get } from "@vercel/edge-config";

export interface PersonalInfo {
  name: string;
  title: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  consultationLink?: string;
  consultationPrice?: string;
}

export async function getPersonalInfo(): Promise<PersonalInfo> {
  const [name, title, linkedin, github, youtube, consultationLink, consultationPrice] = await Promise.all([
    get('name'),
    get('title'),
    get('linkedin'),
    get('github'),
    get('youtube'),
    get('consultationLink'),
    get('consultationPrice'),
  ]);

  return {
    name: (name as string) || 'Your Name',
    title: (title as string) || 'Professional Title',
    linkedin: linkedin as string,
    github: github as string,
    youtube: youtube as string,
    consultationLink: consultationLink as string,
    consultationPrice: consultationPrice as string,
  };
}