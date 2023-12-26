<script>
 export let item
 export let disabledLink = false
 export let albumDisplayed = false
 export let durationDisplayed = true

 import { env } from '$env/dynamic/public'
 import Link from './Link.svelte'
 import ControlerSet from './ControlerSet.svelte'


 $: itemLink = "/item/" + item.id
 $: artistLink = "/artist/" + item.mb_artistid
 $: albumLink = "/album/" + item.album_id

 const getMinute = function(seconds) {
     return Math.floor(seconds/60) 
 }

 const getSecond = function(sec) {
     let seconds = Math.round(sec - 60 * getMinute(sec))

     return (seconds < 10) ? "0"+seconds : seconds
 }
</script>


<div class="item">
    <div class="left">
        {#if albumDisplayed}
            <div class="album">
                <Link path="{albumLink}" alt="{item.album}">
                    <img src="{env.BEETLE_API}/album/{item.album_id}/art" alt="{item.album}" />
                </Link>
            </div>
        {/if}
        <div class="name">
            <span class="title">
                {#if disabledLink}
                    {item.title}
                {:else}
                    <Link path="{itemLink}">{item.title}</Link>
                {/if}
            </span><br/>
            <span class="artist">
                {#if disabledLink}
                    {item.artist}
                {:else}
                    <Link path="{artistLink}">{item.artist}</Link>
                {/if}
            </span>
        </div>
    </div>
    {#if !albumDisplayed && !disabledLink}
    <div class="controls-wrapper">
       <ControlerSet play={false} add={true} items={[item]}/>
    </div>
    {/if}
    <div class="duration {(durationDisplayed) ? '' : 'hidden'}">
        {getMinute(item.length)}:{getSecond(item.length)}
    </div>
</div>

<style>
  .item {
     display: flex;
     width: 100%;
     min-height: 2.2em;
     justify-content: space-between;
     align-items: center;
     min-width:0;
 }

  .item .left {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  min-width:0;
 }

 .item .album img {
     width: 100%;
     border: 1px solid white;
 }

 @media screen and (max-width: 600px) {
     .item .album {
         display: none !important;
     }
 }

 .item .album {
     width: 4.5em;
     max-height: 100%;
     max-width: 25%;
 }

 .item .name, .item .album {
     display: inline-block;
     vertical-align: middle;
     padding: .2em;
 }

 .name {
     padding: .2em;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
 }
 
 .title {
     font-weight: bold;
 }

 .artist {
     font-size: .8em;
 }

 .hidden {
     display: none;
 }

  .controls-wrapper {
    padding: 0 .5em;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 6em;
  }

  .duration {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 2em;
  }

</style>
