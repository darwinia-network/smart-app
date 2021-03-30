import { RouteProps } from 'react-router-dom';
import { Intro } from '../pages/Intro';
import { Transfer } from '../pages/Transfer';

export enum Path {
  root = '/',
  intro = '/intro',
}

export const routes: RouteProps[] = [
  {
    path: Path.root,
    exact: true,
    children: Transfer,
  },
  {
    path: Path.intro,
    children: Intro,
  },
];
