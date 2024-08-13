<script lang="ts">
	import { getSocket } from 'client/communication';
	import { socket } from 'client/communication';

	import { onMount } from 'svelte';

	let messages: string[] = [];

	let message = `Hello world!`;

	const sendMessage = () => {
		if (message.trim()) {
			console.log('Sending message', message);
			getSocket().request('chatMessage', { message });
			message = '';
		}
	};

	onMount(() => {
		$socket.listen('chatMessage', (data) => {
			console.log('Got a chat message', data);
			messages = [...messages, data.message];
		});
	});
</script>

<div class="chat-container">
	<div class="messages">
		{#each messages as message}
			<div class="message">{message}</div>
		{/each}
	</div>
	<div class="input-area">
		<textarea bind:value={message} placeholder="Type your message here..."></textarea>
		<button class="action" on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		margin: 0 auto;
		padding: 0.5rem;
		background-color: var(--color-container);
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.message {
		background-color: var(--color-shade-darker);
		color: var(--color-text);
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		max-width: 80%;
		align-self: flex-start;
	}

	.input-area {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-separator);
	}

	textarea {
		flex-grow: 1;
		resize: none;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--color-input-outline);
		background-color: var(--color-input-background);
		color: var(--color-text);
	}
</style>
