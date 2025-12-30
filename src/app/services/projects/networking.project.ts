import { Project } from '../../models/project.model';

export const PROJECT_NETWORKING: Project = {
  id: 'networking',
  title: 'Networking',
  videoPath: { isIframe: false, path: '/assets/videos/Netw.mp4' },
  tags: ['C#', 'Sockets', 'TCP/IP', 'Game Development'],
  description: `
    <p>
      &emsp; A checkers game you can run on LAN that can handle more than one match at a time.
      The networking system is made using C# sockets (TCP clients) and the BitConverter.
      <br>&emsp; The format is object-based: every message inherits the IMessage interface, which contains
      the data and uses the Packet class to read and write data in the correct order.
      <br>&emsp; The Packet class handles serialization and deserialization. It first reads/writes the hash
      of the IMessage subclass from the network stream, then calls methods that read/write their data.
      <br>&emsp; A heartbeat system automatically disconnects clients or the server if there is no response
      after a few seconds.
      <br>&emsp; Packets also check the last message sent through the network so they can reuse the same byte array.
    </p>
  `,
  timeSpent: '3 weeks',
  downloadLinks: [
    { label: 'Download Server Build', path: '/assets/Downloadables/CheckersServer.zip' },
    { label: 'Download Client Build', path: '/assets/Downloadables/CheckersClient.zip' }
  ],
  githubLink: 'https://github.com/birkaQtrilka/Networked-Checkers',
  credits: [
    {
      name: 'Set-up code made by',
      link: 'https://www.linkedin.com/in/hanswichman/',
      linkLabel: 'Hans Whichman'
    }
  ]
};
