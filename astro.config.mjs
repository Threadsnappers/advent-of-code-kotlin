import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  site: 'https://threadsnappers.github.io',
  base: '/advent-of-code-kotlin/',
  integrations: [
    markdoc(),
    starlight({
      title: 'Threadsnappers',
      editLink: {
        baseUrl: 'https://github.com/Threadsnappers/advent-of-code-kotlin/edit/main/',
      },
      social: {
        github: 'https://github.com/Threadsnappers/advent-of-code-kotlin',
        discord: 'https://discord.gg/NuKDmRUPRm'
      },
      sidebar: [
        {
          label: 'AoC 2022',
          autogenerate: { directory: 'aoc2022'}
        },
        {
          label: 'AoC 2021',
          autogenerate: { directory: 'aoc2021'}
        },
        {
          label: 'AoC 2020',
          autogenerate: { directory: 'aoc2020'}
        },
        {
          label: 'AoC 2019',
          autogenerate: { directory: 'aoc2019'}
        },
        {
          label: 'AoC 2018',
          autogenerate: { directory: 'aoc2018'}
        },
        {
          label: 'AoC 2017',
          autogenerate: { directory: 'aoc2017'}
        },
        {
          label: 'AoC 2016',
          autogenerate: { directory: 'aoc2016'}
        },
        {
          label: 'AoC 2015',
          autogenerate: { directory: 'aoc2015'}
        },
      ],
    }),
  ],
});
