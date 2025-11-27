import type { User } from '../../pages/AdminPages/UserSection/UsersTable';

interface SidebarMenuItem {
  name: string;
  icon: string;
}

export const sidebarMenu: SidebarMenuItem[] = [
  { name: 'Advertisement', icon: '📄' },
  { name: 'My Clients', icon: '👥' },
  { name: 'Users', icon: '🧑' },
  { name: 'Logout', icon: '🔒' },
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
  {
    firstName: 'Jenna',
    lastName: 'Human',
    email: 'jenna@mail.com',
    expiredDate: '04/10/2026',
    foreEverSubscribe: false,
  },
  {
    firstName: 'Jenna',
    lastName: 'Human',
    email: 'jenna@mail.com',
    expiredDate: '04/10/2026',
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
