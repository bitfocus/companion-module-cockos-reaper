import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import dgram from 'node:dgram'
import osc from 'osc'
import { Reaper, ReaperConfiguration } from 'reaper-osc'
import { ActionId, GetActionsList } from '../dist/actions.js'
import { FeedbackId, GetFeedbacksList } from '../dist/feedbacks.js'

test('module actions send UDP OSC and incoming transport state updates feedback', { timeout: 10000 }, async (t) => {
	const peer = dgram.createSocket('udp4')
	peer.bind(0, '127.0.0.1')
	await once(peer, 'listening')
	t.after(() => peer.close())
	const config = new ReaperConfiguration()
	Object.assign(config, {
		localAddress: '127.0.0.1',
		localPort: 0,
		remoteAddress: '127.0.0.1',
		remotePort: peer.address().port,
		numberOfTracks: 1,
		numberOfFx: 1,
	})
	const reaper = new Reaper(config)
	await reaper.start()
	t.after(async () => reaper.stop())
	const context = { reaper, log: () => {} }
	const actions = GetActionsList(() => context)
	const callbackContext = {
		parseVariablesInString: async (value) =>
			typeof value === 'string' ? value.replace('$(custom:value)', '0.75') : value,
	}
	async function execute(actionId, options, address, value) {
		const packet = once(peer, 'message')
		await actions[actionId].callback({ id: 'test', actionId, options }, callbackContext)
		const [bytes] = await packet
		const message = osc.readPacket(bytes, { metadata: true })
		assert.equal(message.address, address)
		if (value !== undefined) assert.equal(message.args[0].value, value)
	}
	await execute(ActionId.Play, {}, '/play')
	await execute(ActionId.CustomMessage, { address: '/test', type: 'f', value: '$(custom:value)' }, '/test', 0.75)
	await execute(ActionId.CustomMessage, { address: '/test', type: 'f', value: 0.5 }, '/test', 0.5)
	await execute(ActionId.CustomMessage, { address: '/test', type: 's', value: 'hello' }, '/test', 'hello')
	await execute(ActionId.CustomMessage, { address: '/toggle', type: 't' }, '/toggle')
	await execute(ActionId.CustomAction, { action_cmd_id: '40044' }, '/action/str', '40044')
	const changes = []
	const feedbackContext = {
		...context,
		bindings: {},
		customMessageFeedbacks: {},
		checkFeedback: (id) => changes.push(id),
	}
	const feedbacks = GetFeedbacksList(() => feedbackContext)
	const event = { id: 'playing', feedbackId: FeedbackId.PlayStatus, options: {} }
	feedbacks[FeedbackId.PlayStatus].subscribe(event, callbackContext)
	const changed = new Promise((resolve) => reaper.transport.onPropertyChanged('isPlaying', resolve))
	peer.send(
		osc.writePacket({ address: '/play', args: [{ type: 'f', value: 1 }] }),
		reaper._osc.socket.address().port,
		'127.0.0.1',
	)
	await changed
	assert.equal(feedbacks[FeedbackId.PlayStatus].callback(event), true)
	assert.deepEqual(changes, ['playing'])
	feedbacks[FeedbackId.PlayStatus].unsubscribe(event)
	const visibility = actions[ActionId.CustomMessage].options.find((option) => option.id === 'value').isVisibleExpression
	assert.equal(visibility, '$(options:type) == "f" || $(options:type) == "s"')
})
