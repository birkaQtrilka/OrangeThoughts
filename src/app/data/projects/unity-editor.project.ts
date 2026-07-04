import { Project } from "../../models/project.model";

export const PROJECT_UNITY_EDITOR: Project = {
  id: 'unity-editor',
  title: 'Unity Editor',
  videoPath: {
    isIframe: true,
    path: 'https://www.youtube.com/embed/fxm84SgOHKQ?si=7dpSixjv1GXwiqsv'
  },
  tags: ['C#', 'Unity', 'Editor Scripting', 'Tool Development'],
  description: `
    <h3>Product</h3>
    <p>
      &emsp; I made a Unity tool that allows you to spawn worlds through the wave function collapse
      algorithm. It's a scriptable object with a custom editor in which you can add tiles with varying
      socket types.
    </p>
    <h3>My Contributions</h3>
    <p>
      &emsp; In this project, I learned how to use the Unity editor API and how to decouple data and
      behavior. I also learned about serialized properties and how to save data changed in the editor.
      <br>&emsp; The main challenge was serializing the data and saving it after every change. The editor
      also has some performance issues that I still need to solve.
    </p>
  `,
  timeSpent: '1 week',
  downloadLinks: [
    { label: 'Download the Unity Editor Tool', path: '/assets/Downloadables/UnityEditorTool.zip' }
  ],
  githubLink: 'https://github.com/birkaQtrilka/LearningEditor',
  credits: [
    {
      name: 'Solo development',
      link: '',
      linkLabel: ''
    }
  ]
};
