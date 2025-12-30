import { Project } from "../../models/project.model";

export const PROJECT_INTERNSHIP_TIBLE: Project = {
  id: 'internship-tible',
  title: 'Internship at Tible',
  videoPath: { isIframe: false, path: '/assets/videos/VueWebsiteDEMO.mp4' },
  tags: ['Angular', 'Dashboard', 'Data Visualization', 'Internship', 'Frontend'],
  description: `
    <p>
      &emsp; During this internship I was responsible for the front-end of a dashboard application.
      It was made for Statiegeld Nederland, a Dutch organization that promotes the return of bottles
      and cans. The web app was built with Angular and TypeScript. It features data visualization with
      charts and graphs, user authentication, and data filtering using custom form fields.
      <br>&emsp; The main challenge was working with an existing codebase and learning new technologies
      in a short period of time. I had to learn Jira, Confluence, Jenkins, Spring Boot, and other tools
      used in the company.
    </p>
  `,
  timeSpent: '6 months',
  credits: [
    {
      name: 'The company website',
      link: 'https://tible.com/en',
      linkLabel: 'Tible.com'
    }
  ]
};
