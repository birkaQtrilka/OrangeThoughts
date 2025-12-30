import { Project } from "../../models/project.model";

export const PROJECT_FRONT_END: Project = {
  id: 'front-end',
  title: 'Front End',
  videoPath: { isIframe: false, path: '/assets/videos/VueWebsiteDEMO.mp4' },
  tags: ['Vue.js', 'Vuex', 'Mobile First Design', 'Frontend Development'],
  description: `
    <p>
      &emsp; A house listing web application made with Vue.js and Vuex. It uses a mock API to fetch
      the data.
      <br>&emsp; The application has mobile and desktop versions and is responsive. The mobile version differs
      not only in layout but also in functionality, using a bottom navigation bar and images instead of text
      for navigation buttons.
      <br>&emsp; It includes a search bar that filters houses by name, and a filter that sorts them by
      price and size.
      <br>&emsp; The main challenge was separating the code into conceptual segments, making it easier to
      read and maintain.
    </p>
  `,
  timeSpent: '36 hours',
  githubLink: 'https://github.com/birkaQtrilka/vue-start-spa',
  credits: [
    {
      name: 'Assets and API',
      link: 'https://www.d-tt.nl/en/',
      linkLabel: 'D-TT'
    }
  ]
};
