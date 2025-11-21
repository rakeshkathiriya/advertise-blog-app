import type { Client } from '../../pages/AdminPages/ClientSection/ClientsTable';

interface SidebarMenuItem {
  name: string;
  icon: string;
}

export const sidebarMenu: SidebarMenuItem[] = [
  { name: 'Articles', icon: '📄' },
  { name: 'My Clients', icon: '👥' },
  { name: 'Users', icon: '🧑' },
  { name: 'Logout', icon: '🔒 ' },
];

export const initialClients: Client[] = [
  {
    name: 'Nandor the Relentless',
    poc: 'User 1',
    email: 'user1@mail.com',
    postLimit: '2',
    expiredDate: '12/12/2023',
  },
  {
    name: 'Marceline Nightshade',
    poc: 'User 2',
    email: 'user2@mail.com',
    postLimit: '4',
    expiredDate: '05/01/2024',
  },
  {
    name: 'Victor Stormborn',
    poc: 'User 3',
    email: 'user3@mail.com',
    postLimit: '2',
    expiredDate: '18/02/2024',
  },
  {
    name: 'Selena Darkwood',
    poc: 'User 4',
    email: 'user4@mail.com',
    postLimit: '6',
    expiredDate: '27/03/2024',
  },
  {
    name: 'Leo Firecrest',
    poc: 'User 5',
    email: 'user5@mail.com',
    postLimit: '3',
    expiredDate: '10/04/2024',
  },
  {
    name: 'Elara Moonfall',
    poc: 'User 6',
    email: 'user6@mail.com',
    postLimit: '1',
    expiredDate: '29/04/2024',
  },
  {
    name: 'Corvin Blackthorn',
    poc: 'User 7',
    email: 'user7@mail.com',
    postLimit: '8',
    expiredDate: '15/05/2026',
  },
  {
    name: 'Isabella Ravensong',
    poc: 'User 8',
    email: 'user8@mail.com',
    postLimit: '5',
    expiredDate: '02/06/2026',
  },
  {
    name: 'Damien Frostborn',
    poc: 'User 9',
    email: 'user9@mail.com',
    postLimit: '3',
    expiredDate: '19/06/2026',
  },
  {
    name: 'Lyra Starcrest',
    poc: 'User 10',
    email: 'user10@mail.com',
    postLimit: '2',
    expiredDate: '30/06/2024',
  },
];
