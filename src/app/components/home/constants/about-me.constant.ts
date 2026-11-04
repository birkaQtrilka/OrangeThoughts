import { Profile } from '../../../services/profile.service';

export const INTRO: Record<Profile, [string, string]> = {
  'game-dev': ['Tooling Engineer', "Over the past 4 years I have been making games solo and in teams<br>I'm focusing on becoming a good tooling engineer"],
  'web-dev': ['Front-End Developer', "Over the past 4 years I have been building interactive applications and developer tools<br>I'm focusing on fast, polished Angular front-ends"],
  'software-dev': ['Software Engineer', "Over the past 4 years I have been building software, tools and real-time systems<br>I'm focusing on reliable, well-structured code in C++, C# and Java"],
}

export const ABOUT_ME: Record<Profile, string> = {
  'game-dev': `
  <p>
      I am Stefan Carpeliuc, a game programmer specializing in tooling engineering with over 4 years of experience building games, shaders, and development tools.
    </p>
    <p>
      I study Creative Media and Game Technologies at Saxion University of Applied Sciences. My work focuses on game design procedural generation, editor tooling, Unity editor tools, optimization techniques, and Front-end development.
    </p>
    <p>
      I enjoy building tools that make developers faster and workflows cleaner. Rather than focusing only on gameplay features, I design systems that enable teams to iterate efficiently and scale complex content with confidence.
    </p>
    <p>
      In team environments, I bring strong communication and leadership skills. I served as Scrum Master in all group projects, handling planning, task breakdown, and coordination to consistently deliver results. I also gained professional experience during my internship at Tible, working on production level Angular+SpringBoot applications.
    </p>
    <p>
      Outside of coursework, I continuously build side projects, exploring topics such as procedural generation, spatial partitioning, and shader coding.
    </p>
    <p>
      I am currently looking for opportunities as a game programmer, with a focus on tooling engineering and graphics coding.
    </p>`,
  'web-dev': `
    <p>
      I am Stefan Carpeliuc, a front-end focused software developer with over 4 years of experience building interactive applications, developer tools, and shader-driven visuals for the web and beyond.
    </p>
    <p>
      I study Creative Media and Game Technologies at Saxion University of Applied Sciences, where I've built a strong foundation in software architecture, performance optimization, and clean, maintainable code. My work centers on front-end development, tooling, and building systems that stay fast as they grow.
    </p>
    <p>
      During my internship at Tible, I worked on production-level Angular and Spring Boot applications, contributing across the stack in a real team environment with real deliverables.
    </p>
    <p>
      I enjoy building tools that make developers faster and workflows cleaner. Rather than focusing only on individual features, I design systems that let teams iterate efficiently and scale complex functionality with confidence.
    </p>
    <p>
      In team environments, I bring strong communication and leadership skills. I served as Scrum Master in all group projects, handling planning, task breakdown, and coordination to consistently deliver results.
    </p>
    <p>
      This portfolio is itself a product of that approach: its background is rendered with custom GLSL shaders, combining my graphics programming experience with front-end engineering. Outside of coursework, I keep building side projects in procedural generation, spatial partitioning, and shader coding, all while maintaining high grades.
    </p>
    <p>
      I am currently looking for opportunities as a web or front-end developer, where I can combine Angular and modern web technologies with my strengths in performance, tooling, and visual programming.
    </p>
  `,
  'software-dev': `
    <p>
      I am Stefan Carpeliuc, a software developer with over 4 years of experience building applications, development tools, and real-time systems in C++, C#, and Java.
    </p>
    <p>
      I study Creative Media and Game Technologies at Saxion University of Applied Sciences, where I've built a strong foundation in software architecture, performance optimization, and clean, maintainable code. My foundation is in C++ and C#, and I pick up whatever a project needs, from Rust and Python to Vue.
    </p>
    <p>
      My projects reflect that range. I built a configurable Windows file watcher in C++ that monitors directories, waits for files to become stable, and runs rule-based actions defined in JSON, with recovery built in for when the system's notification buffer overflows. For my honours program I developed a local co-op XR application for visualizing data in an interactable graph, where I worked mainly on the networking code and the XR interaction. I am also building a training simulation for healthcare providers in which multiple AI agents interact with each other and a digital world.
    </p>
    <p>
      During my internship at Tible, I worked on production-level Angular and Spring Boot applications. I joined an existing codebase, learned tools like Jira, Confluence, and Jenkins quickly, and became comfortable debugging and profiling code I did not write.
    </p>
    <p>
      I enjoy building tools that make developers faster and workflows cleaner. I care about performance and have optimized systems with data-oriented design, including Unity's DOTS, to make code run efficiently across multiple threads.
    </p>
    <p>
      In team environments, I bring strong communication and leadership skills. I served as Scrum Master in all group projects, handling planning, task breakdown, and coordination to consistently deliver results.
    </p>
    <p>
      I am currently looking for opportunities as a software developer, where I can apply my C++ and C# background to reliable, real-world systems.
    </p>
  `,
};