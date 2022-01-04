<script>
 export let item
 export let disabledLink = false
 export let albumDisplayed = false
 export let durationDisplayed = true

 $: itemLink = "./item/" + item.id
 $: artistLink = "./artist/" + item.mb_artistid
 $: albumLink = "./album/" + item.album_id

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
                <a href="{albumLink}" title="{item.album}">
                    <img src="{process.env.BEETLE_API}/album/{item.album_id}/art" alt="{item.album}" />
                </a>
            </div>
        {/if}
        <div class="name">
            <div class="title">
                {#if disabledLink}
                    {item.title}
                {:else}
                    <a href="{itemLink}">{item.title}</a>
                {/if}
            </div>
            <div class="artist">
                {#if disabledLink}
                    {item.artist}
                {:else}
                    <a href="{artistLink}">{item.artist}</a>
                {/if}
            </div>
        </div>
    </div>
    <div class="duration {(durationDisplayed) ? '' : 'hidden'}">
        {getMinute(item.length)}:{getSecond(item.length)}
    </div>
</div>

<style>
 .item {
     width: 100%;
     display: flex;
     justify-content: space-between;
     align-items: center;
 }

 .item .left {
     flex-grow: 1;
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

 .item .title {
     font-weight: bold;
 }

 .item .artist {
     font-size: .8em;
 }

 .hidden {
     display: none;
 }
</style>
