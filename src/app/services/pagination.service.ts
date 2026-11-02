import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";

@Injectable()
export class PaginationService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map(params => {
        const page = parseInt(params.get('page') ?? '', 10);
        return Number.isNaN(page) || page < 0 ? 0 : page;
      })
    ),
    { initialValue: 0 }
  );

  /** Slug of the adventure the URL asks to focus, or null. */
  focus = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('focus')?.trim().toLowerCase() ?? null)
    ),
    { initialValue: null }
  );

  /**
   * Sets the page. `focus` is cleared by default (null removes the param with 'merge'),
   * so user-driven navigation never keeps a stale focus in the URL.
   */
  setPage(num: number, opts: { focus?: string | null; replaceUrl?: boolean } = {}) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: num, focus: opts.focus ?? null },
      queryParamsHandling: 'merge',
      replaceUrl: opts.replaceUrl ?? false,
    });
  }
}