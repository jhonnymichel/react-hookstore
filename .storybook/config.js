import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js|mdx
configure(require.context('../stories', true, /\.stories\.js|mdx$/), module);
