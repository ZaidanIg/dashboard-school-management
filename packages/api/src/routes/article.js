import * as handlers from '../handlers/article.js'

export const articleRoutes = [
    {
        method: 'GET',
        path: '/api/articles',
        handler: handlers.listArticles,
        options: {
            tags: ['api', 'articles'],
            description: 'List all articles with filters & pagination'
        }
    },
    {
        method: 'GET',
        path: '/api/articles/stats',
        handler: handlers.getArticleStats,
        options: {
            tags: ['api', 'articles'],
            description: 'Get article portal summary stats'
        }
    },
    {
        method: 'GET',
        path: '/api/articles/{id}',
        handler: handlers.getArticle,
        options: {
            tags: ['api', 'articles'],
            description: 'Get single article by id'
        }
    },
    {
        method: 'POST',
        path: '/api/articles',
        handler: handlers.createArticle,
        options: {
            tags: ['api', 'articles'],
            description: 'Create new article'
        }
    },
    {
        method: 'PUT',
        path: '/api/articles/{id}',
        handler: handlers.updateArticle,
        options: {
            tags: ['api', 'articles'],
            description: 'Update article'
        }
    },
    {
        method: 'DELETE',
        path: '/api/articles/{id}',
        handler: handlers.deleteArticle,
        options: {
            tags: ['api', 'articles'],
            description: 'Delete article'
        }
    }
]
