import { Project } from "../../models/project.model";

export const PROJECT_FILE_WATCHER: Project = {
  id: 'file-watcher',
  title: 'File Watcher Daemon',
  videoPath: { isIframe: true, path: 'https://res.cloudinary.com/uj9ir4ss/video/upload/v1792764402/watched-files-demo_qyruvb.mp4' },
  tags: ['C++', 'OOP', 'Tests', 'Dependency-Inversion'],
  description: `
    <p>
      &emsp; I wanted to make a tool that I would use in my day to day life and also learn the modern C++ features. 
      My priority was to make it extensible, make it conform to the SOLID principles and make it easy to test.
      At the time of writing, the project was in it's verticle slice state. It was missing implementations for MacOS and Linux and it was limited 
      in the amount of actions it can perform to 3.
      <br><h2>About the Project</h2>
      <br>&emsp; A configurable Windows file-watching application written in C++ that monitors a directory and automatically performs actions on files based on configurable rules.
      <br>&emsp; FileWatcher detects file system changes, waits for files to become stable, and executes matching actions such as sending files to Telegram, removing filename patterns, or moving files to another directory.
      <br>&emsp; Rules and application settings are configured through JSON files, allowing behavior to be customized without modifying the source code.
      <br><br>
      What I liked was to make the system multi-threaded. I learned how to use mutex to build a thread safe queue, and how to use the producer-consumer pattern
      in order to sepparate concerns and to make the application a lot faster.
      <br>
      My biggest challenge was to design the FileEvent system in a way that is extensible and to separate system events such as BufferOverflow from file events
      such as Renamed. I used a multitude of techiques including the new c++ feature of std::variant. 
    </p>
  `,
  timeSpent: '1 week',
  githubLink: 'https://github.com/birkaQtrilka/extension-app',
  credits: [
    {
      link: "https://pixabay.com/users/monument_music-34040748/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=178951",
      name: "Music by",
      linkLabel: "Oleksii Holubiev"
    },
    {
      link: "https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=178951",
      name: "From",
      linkLabel: "Pixabay"
    }
  ]
};
