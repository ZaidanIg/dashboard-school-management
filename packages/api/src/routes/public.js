import * as publicHandlers from '../handlers/public.js'
import * as articleHandlers from '../handlers/article.js'

export const publicRoutes = [
    {
        method: 'GET',
        path: '/public/landing',
        options: {
            auth: false,
            handler: publicHandlers.getLandingData,
            description: 'Aggregated public data for the landing page',
            tags: ['api', 'public']
        }
    },
    {
        method: 'GET',
        path: '/public/articles',
        options: {
            auth: false,
            handler: articleHandlers.listPublicArticles,
            description: 'Public list of published news and articles',
            tags: ['api', 'public', 'articles']
        }
    },
    {
        method: 'GET',
        path: '/public/articles/{slug}',
        options: {
            auth: false,
            handler: articleHandlers.getPublicArticleBySlug,
            description: 'Public single article by slug with views increment',
            tags: ['api', 'public', 'articles']
        }
    }
]
