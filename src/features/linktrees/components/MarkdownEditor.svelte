<script>
  import { onMount } from "svelte";
  import Editor from "@toast-ui/editor";
  import "@toast-ui/editor/dist/toastui-editor.css";

  let { value, onchange } = $props();

  let container = $state();

  onMount(() => {
    const editor = new Editor({
      el: container,
      initialValue: value,
      height: "200px",
      initialEditType: "markdown",
      previewStyle: "tab",
      usageStatistics: false,
      events: {
        change: () => onchange(editor.getMarkdown()),
      },
    });

    return () => editor.destroy();
  });
</script>

<div bind:this={container}></div>
