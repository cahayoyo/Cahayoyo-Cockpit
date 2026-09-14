<script lang="ts">
	// Folder select with breadcrumb labels — used by the toolbar filter and the editor.
	import * as Select from '$lib/components/ui/select/index.js';
	import { folderLabel, type PrototypeFolder } from './data.js';

	let {
		value = $bindable('all'),
		folders,
		empty,
		label,
		class: className
	}: {
		value?: string;
		folders: PrototypeFolder[];
		empty: { value: string; label: string };
		label: string;
		class?: string;
	} = $props();

	const currentLabel = $derived(
		value === empty.value ? empty.label : folderLabel(folders, value) || empty.label
	);
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class={className} aria-label={label}>{currentLabel}</Select.Trigger>
	<Select.Content>
		<Select.Item value={empty.value} label={empty.label}>{empty.label}</Select.Item>
		{#each folders as f (f.id)}
			{@const path = folderLabel(folders, f.id)}
			<Select.Item value={f.id} label={path}>{path}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
