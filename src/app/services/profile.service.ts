import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

export const PROFILES = ['web-dev', 'game-dev'] as const;
export type Profile = (typeof PROFILES)[number];
export const DEFAULT_PROFILE: Profile = 'game-dev';

function isProfile(value: unknown): value is Profile {
  return PROFILES.includes(value as Profile);
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly router = inject(Router);

  private readonly rawProfile = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.parseUrl(this.router.url).queryParams['profile'] as string | undefined),
    ),
    { initialValue: undefined },
  );

  /** The profile explicitly requested in the URL, or null if missing/unknown. */
  readonly requested = computed<Profile | null>(() => {
    const p = this.rawProfile();
    return isProfile(p) ? p : null;
  });

  /** The profile used to pick content (falls back to the default). */
  readonly active = computed<Profile>(() => this.requested() ?? DEFAULT_PROFILE);

  /** Ready-to-bind query params: only `profile`, and only if it's valid. */
  /** Ready-to-bind query params: only `profile`, and only if it's valid. */
  readonly queryParams = computed<Record<string, string>>(() => {
    const p = this.requested();
    const params: Record<string, string> = {};
    if (p) {
      params['profile'] = p;
    }
    return params;
  });
}