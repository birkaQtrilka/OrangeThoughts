import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class GitService {

  constructor(private httpClient: HttpClient) {
    
  }

  public getLastUpdated(owner: string, repo: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}`);
  }

  public extractOwnerRepo(url: string | undefined): { owner: string; repo: string } | null {
    if (!url) {
      return null;
    }
    try {
      const parsedUrl = new URL(url);

      const parts = parsedUrl.pathname
        .replace(/\.git$/, '')
        .split('/')
        .filter(Boolean); // remove empty strings

      if (parts.length >= 2) {
        return {
          owner: parts[0],
          repo: parts[1]
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
