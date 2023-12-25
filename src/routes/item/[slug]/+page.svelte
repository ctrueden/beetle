<script>
 import ControlerSet from '../../../components/ControlerSet.svelte'
 import Link from '../../../components/Link.svelte'
 import fileUrl from '../../../libs/file-url'
 export let data
 $: item = data.item
 
 function htmlLyrics(text) {
     return text.replace(/[\n|\r]/g, '<br/>')
 }
</script>

<svelte:head>
    <title>{item.album}</title>
</svelte:head>

<header>
    <h1>{item.title}</h1>
    <ul>
        <li>
            <strong>Album: </strong> <Link path="/album/{item.album_id}">{item.album}</Link>
        </li>
        <li>
            <strong>Artist: </strong> <Link path="/artist/{item.mb_artistid}">{item.artist}</Link>
        </li>
        <li><strong>Date: </strong>{item.original_year}</li>
        <!-- <li><strong>MusicBrainz: </strong> <a href="https://musicbrainz.org/track/{item.mb_trackid}">{item.mb_albumid}</a></li> -->
    </ul>
    <ControlerSet items="{[item]}" />
    <a href="{fileUrl(item)}" download>download</a>
</header>
{#if item.lyrics}
    <div class="lyrics">
        <h2>Lyrics</h2>
        <p>{@html htmlLyrics(item.lyrics)}</p>
    </div>
{/if}


<style>
 .lyrics {
     margin-top: 2em;
 }
</style>

