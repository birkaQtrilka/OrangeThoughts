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
      map(params =>{
        const page = params.get('page');
        return page ? parseInt(page, 10) : 0; 
      })
    ),
    { initialValue: 0 }
  );

  setPage(num: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: num },
      queryParamsHandling: 'merge' // 'merge' preserves any other query params (like ?sort=asc)
    })
  }
}