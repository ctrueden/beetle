<script>
 export let items
 export let play = true
 export let add = true
 export let like = true
 export let after = true

import QueueInsert from './QueueInsert.svelte'
 import PlaylistAddControler from './PlaylistAddControler.svelte'

</script>

<div class="controls">
  {#if play}
    <div class="control">
        <QueueInsert items="{items}" forcePlay="{true}" />
    </div>
  {/if}
  {#if after}
    <div class="control">
        <QueueInsert items="{items}" addAfter="{true}" />
    </div>
  {/if}
  {#if add}
    <div class="control">
        <QueueInsert items="{items}" forcePlay="{false}" />
    </div>
  {/if}
  {#if like}
    <div class="control">
        <PlaylistAddControler items="{items}"/>
    </div>
  {/if}
</div>