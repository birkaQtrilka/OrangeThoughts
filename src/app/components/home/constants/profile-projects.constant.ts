import { Profile } from '../../../services/profile.service';
import { ProjectId } from './project-cards.constant';

export const PROFILE_PROJECTS: Record<Profile, readonly ProjectId[]> = {
  'web-dev': [
    'internship-tible',
    'front-end',
    'networking',
    'procedural-generation',
    'procedural-planets',
    'file-watcher',
  ],
  'game-dev': [
    'procedural-planets',
    'the-miller',
    'file-watcher',
    'ball-blaze',
    'proposals',
    'procedural-generation',
    'networking',
  ],
};