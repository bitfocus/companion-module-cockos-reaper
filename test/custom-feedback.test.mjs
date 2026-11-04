import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FeedbackId, GetFeedbacksList } from '../dist/feedbacks.js'

function fixture() {
	const changes = []
	const context = {
		customMessageFeedbacks: {},
		checkFeedback: (id) => changes.push(id),
		log: () => {},
	}
	const definition = GetFeedbacksList(() => context)[FeedbackId.CustomMessage]
	let event = {
		id: 'custom',
		feedbackId: FeedbackId.CustomMessage,
		options: { msg: '/custom', type: 's', value: 'A' },
	}
	// API 1.15 supplies host-prepared options; its subscription parser is a no-op.
	definition.subscribe(event, { parseVariablesInString: async (value) => value })
	return {
		changes,
		update(options) {
			event = { ...event, options: { ...event.options, ...options } }
			return definition.callback(event)
		},
		async receive(address, type, value) {
			const handled = context.customMessageFeedbacks.custom.handler.handle({
				address,
				args: [{ type, value }],
			})
			await new Promise(setImmediate)
			return { handled, state: definition.callback(event) }
		},
		unsubscribe() {
			definition.unsubscribe(event)
			assert.equal(context.customMessageFeedbacks.custom, undefined)
		},
	}
}

test('custom feedback uses refreshed prepared comparison values', async () => {
	const f = fixture()
	assert.equal((await f.receive('/custom', 's', 'A')).state, true)
	f.update({ value: 'B' })
	assert.equal((await f.receive('/custom', 's', 'B')).state, true)
	assert.equal((await f.receive('/custom', 's', 'A')).state, false)
	assert.ok(f.changes.length > 0)
	f.unsubscribe()
})

test('custom feedback rebuilds handlers when prepared address or type changes', async () => {
	const f = fixture()
	f.update({ msg: '/number', type: 'f', value: '2.5' })
	assert.equal((await f.receive('/custom', 's', 'A')).handled, false)
	assert.deepEqual(await f.receive('/number', 'f', 2.5), { handled: true, state: true })
	f.update({ value: '3.5' })
	assert.equal((await f.receive('/number', 'f', 3.5)).state, true)
	assert.equal((await f.receive('/number', 'f', 2.5)).state, false)
	f.unsubscribe()
})

test('custom feedback compares prepared literal variable syntax directly', async () => {
	const f = fixture()
	f.update({ value: '$(custom:literal)' })
	assert.equal((await f.receive('/custom', 's', '$(custom:literal)')).state, true)
	f.unsubscribe()
})
