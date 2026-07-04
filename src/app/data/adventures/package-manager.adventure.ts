import { CodingAdventure } from "../../models/coding-adventure.model";

export const CODING_PACKAGE_MANAGER: CodingAdventure = {
  id: 'PKG',
  title: 'My library manager',
  videoPath: '/assets/videos/libmanDEMO.mp4',
  tags: ['CLI Tools', 'Side Project'],
  description: `
    &emsp; A custom local package manager I made for the purpose of quickly moving useful files into
    a local library. Files are copied into a unity project, where I can quickly test and refactor scripts.
    Any change to the library is wrapped in git operations to allow for backtracking. Packages can be made
    in the unity package manager standard (e.g. runtime and editor assemblies).
    <br>Other features: 
    <br>&emsp;&emsp; Can add native c# scripts
    <br>&emsp;&emsp; Can add/delete one file at a time or whole directories
    <br>&emsp;&emsp; Lists all packages
    <br>&emsp;&emsp; Every command has autocomplete in powershell
    <br>&emsp;&emsp; Can do a dry-run to test what could happen
    <br>&emsp;&emsp; --help command to see all usages with examples
  `,
  timeSpent: '8 days',
  images: ['/assets/Images/SideProjects/LibmanScreenshot.png'],
  githubLink: 'https://github.com/birkaQtrilka/MyLibraryManager'
};
