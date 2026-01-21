import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import Hapi from '@hapi/hapi'
import { registerPlugins } from '../src/plugins/index.js'
import { registerRoutes } from '../src/routes/index.js'
import { errorHandler } from '../src/middleware/errorHandler.js'

describe('API Server', () => {
    let server

    before(async () => {
        server = Hapi.server({ port: 0 }) // Random port
        await registerPlugins(server)
        errorHandler(server)
        registerRoutes(server)
        await server.initialize()
    })

    after(async () => {
        await server.stop()
    })

    test('health endpoint returns ok', async () => {
        const res = await server.inject({ method: 'GET', url: '/health' })
        assert.strictEqual(res.statusCode, 200)
        const payload = JSON.parse(res.payload)
        assert.strictEqual(payload.status, 'ok')
        assert.ok(payload.timestamp)
        assert.ok(typeof payload.uptime === 'number')
    })

    test('GET /api/students returns array', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/students' })
        assert.strictEqual(res.statusCode, 200)
        const payload = JSON.parse(res.payload)
        assert.ok(Array.isArray(payload.data))
        assert.ok(payload.meta)
    })

    test('GET /api/teachers returns array', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/teachers' })
        assert.strictEqual(res.statusCode, 200)
        const payload = JSON.parse(res.payload)
        assert.ok(Array.isArray(payload.data))
    })

    test('GET /api/academic/years returns array', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/academic/years' })
        assert.strictEqual(res.statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(res.payload)))
    })

    test('GET /api/academic/subjects returns array', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/academic/subjects' })
        assert.strictEqual(res.statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(res.payload)))
    })

    test('GET /api/finance/dashboard returns stats', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/finance/dashboard' })
        assert.strictEqual(res.statusCode, 200)
        const payload = JSON.parse(res.payload)
        assert.ok('totalBillings' in payload)
    })

    test('GET /api/settings/roles returns array', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/settings/roles' })
        assert.strictEqual(res.statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(res.payload)))
    })

    test('invalid route returns 404', async () => {
        const res = await server.inject({ method: 'GET', url: '/api/nonexistent' })
        assert.strictEqual(res.statusCode, 404)
    })

    test('POST /api/students with invalid data returns 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/students',
            payload: { name: 'Test' } // Missing required fields
        })
        assert.strictEqual(res.statusCode, 400)
    })
})
