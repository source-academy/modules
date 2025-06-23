import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import React from 'react';
import { Links } from './constants';

const Game: React.FC = () => {
  return <div>
    Info: You need to visit the game to see the effect of your program.
    Remember to save your work first!
    <br />
    <br />
    You may find the game module{' '}
    <a
      href={Links.gameAPIDocumentation}
      rel="noopener noreferrer"
      target="_blank"
    >
      documentation{' '}
    </a>
    and{' '}
    <a href={Links.gameUserGuide} rel="noopener noreferrer" target="_blank">
      user guide{' '}
    </a>
    useful.
  </div>;
};

export default defineTab({
  toSpawn: () => true,
  body: () => <Game />,
  label: 'Game Info Tab',
  iconName: 'info-sign'
});
