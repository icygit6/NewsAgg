import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';

// Every page is a router-native lazy route, so the initial bundle ships only
// the shell; each page's chunk loads on first navigation.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/Home')).Home }) },
      {
        path: 'top-headlines',
        lazy: async () => ({ Component: (await import('./pages/TopHeadlines')).TopHeadlines }),
      },
      {
        path: 'bookmarks',
        lazy: async () => ({ Component: (await import('./pages/BookmarksPage')).BookmarksPage }),
      },
      {
        path: 'country/:iso',
        lazy: async () => ({ Component: (await import('./pages/CountryPage')).CountryPage }),
      },
      {
        path: 'article/:id',
        handle: { hideRightRail: true, wide: true },
        lazy: async () => ({ Component: (await import('./pages/ArticlePage')).ArticlePage }),
      },
      { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).NotFound }) },
    ],
  },
]);
