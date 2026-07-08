import { SafeResourceUrl } from "@angular/platform-browser";

export interface VideoPath {
  isIframe: boolean; 
  path: string;
  hideOnMobile?: boolean;
}