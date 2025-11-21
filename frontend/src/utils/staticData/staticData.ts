import type { Client } from '../../pages/AdminPages/ClientSection/ClientsTable';
import type { User } from '../../pages/AdminPages/UserSection/UsersTable';

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

export const initialUsers: User[] = [
  {
    firstName: 'Nandor the Relentless',
    lastName: 'User 1',
    email: 'user1@mail.com',
    expiredDate: '12/12/2023',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Laszlo',
    lastName: 'Cravensworth',
    email: 'laszlo@mail.com',
    expiredDate: '01/05/2025',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Nadja',
    lastName: 'of Antipaxos',
    email: 'nadja@mail.com',
    expiredDate: '03/08/2024',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Guillermo',
    lastName: 'de la Cruz',
    email: 'gdelacruz@mail.com',
    expiredDate: '09/15/2024',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Colin',
    lastName: 'Robinson',
    email: 'colinr@mail.com',
    expiredDate: '11/30/2026',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Simon',
    lastName: 'The Devious',
    email: 'simon@mail.com',
    expiredDate: '02/14/2024',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Viago',
    lastName: 'Vampire',
    email: 'viago@mail.com',
    expiredDate: '05/20/2025',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Deacon',
    lastName: 'Brücke',
    email: 'deacon@mail.com',
    expiredDate: '06/18/2024',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Petyr',
    lastName: 'Ancient One',
    email: 'petyr@mail.com',
    expiredDate: '08/01/2023',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Jenna',
    lastName: 'Human',
    email: 'jenna@mail.com',
    expiredDate: '04/10/2026',
    foreEverSubscribe: false,
  },
];

export const initialForeEverUsers: User[] = [
  {
    firstName: 'Nandor the Relentless',
    lastName: 'User 1',
    email: 'user1@mail.com',
    expiredDate: '12/12/2023',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Laszlo',
    lastName: 'Cravensworth',
    email: 'laszlo@mail.com',
    expiredDate: '01/05/2025',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Nadja',
    lastName: 'of Antipaxos',
    email: 'nadja@mail.com',
    expiredDate: '03/08/2024',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Guillermo',
    lastName: 'de la Cruz',
    email: 'gdelacruz@mail.com',
    expiredDate: '09/15/2024',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Colin',
    lastName: 'Robinson',
    email: 'colinr@mail.com',
    expiredDate: '11/30/2026',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Simon',
    lastName: 'The Devious',
    email: 'simon@mail.com',
    expiredDate: '02/14/2024',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Viago',
    lastName: 'Vampire',
    email: 'viago@mail.com',
    expiredDate: '05/20/2025',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Deacon',
    lastName: 'Brücke',
    email: 'deacon@mail.com',
    expiredDate: '06/18/2024',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Petyr',
    lastName: 'Ancient One',
    email: 'petyr@mail.com',
    expiredDate: '08/01/2023',
    foreEverSubscribe: true,
  },
  {
    firstName: 'Jenna',
    lastName: 'Human',
    email: 'jenna@mail.com',
    expiredDate: '04/10/2026',
    foreEverSubscribe: true,
  },
];
