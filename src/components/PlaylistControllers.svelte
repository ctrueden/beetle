<script>
 export let items

 import PlaylistInsert from './PlaylistInsert.svelte'

</script>

<div class="controls">
    <div class="control">
        <PlaylistInsert items="{items}" forcePlay="{true}" />
    </div>
    <div class="control">
        <PlaylistInsert items="{items}" forcePlay="{false}" />
    </div>
</div>

<style>
 .controls {
     display:flex;
     height: 2.2em;
 }

 .control {
     flex-basis: 2.2em;
 }
</style>
