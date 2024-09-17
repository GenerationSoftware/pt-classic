<script lang="ts">
  export let title: string
  export let onOpen: () => void = () => {}
  export let onClose: () => void = () => {}

  let dialog: HTMLDialogElement

  const open = () => {
    onOpen?.()
    dialog.showModal()
  }

  const close = () => {
    onClose?.()
    dialog.close()
  }
</script>

<button on:click={open}>
  <slot name="button-content" />
</button>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:click|self={close}>
  <div id="content">
    <div id="header">
      <h3>{title}</h3>
      <button id="close" on:click={close}>X</button>
    </div>
    <slot name="modal-content" />
  </div>
</dialog>

<style>
  dialog {
    --padding: 1rem;
    max-width: calc(100% - 2rem - (2 * var(--padding)));
    max-height: 60vh;
    padding: var(--padding);
    color: var(--pt-teal-light);
    background-color: var(--pt-purple-600);
    border: none;
    border-radius: 1rem;
  }

  dialog[open] {
    animation: fade 100ms ease-in;
  }

  dialog::backdrop {
    background-color: rgba(1, 1, 7, 0.3);
    backdrop-filter: blur(2px);
  }

  div#content {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  div#header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    line-height: 150%;
  }

  button#close {
    padding: 0.25rem;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
