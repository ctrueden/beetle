<script>
 import { env } from '$env/dynamic/public'
 import { goto } from '$app/navigation'
 import { base } from '$app/paths'
 import Search from '../components/Search.svelte'

 let handleSearch = function(event) {
     const query = event.detail
     if (query) {
         const location = base + '/search/' + encodeURI(query)
         goto(location)
     }
 }
 let segment = undefined
</script>


<nav>
    <ul>
	<li>
            <a aria-current='{segment === undefined ? "page" : undefined}' href='{base}/'>
                <img src="{base}/logo-192.png" class="logo" alt="logo" />
            </a>
        </li>
	<!-- <li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li> -->

	<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
	     the blog data when we hover over the link or tap it on a touchscreen -->
	<li>
            <a  aria-current='{(segment === "artist" || segment === "artistIndex") ? "page" : undefined}' href='{base}/artistIndex/A'>artists</a>
        </li>
        {#if env.BEETLE_PLAYLISTS != undefined }
            <li>
                <a  aria-current='{(segment === "playlist") ? "page" : undefined}' href='{base}/playlist'>playlists</a>
            </li>
        {/if}
    </ul>
    <div class="search">
        <Search on:search="{handleSearch}" />
    </div>
</nav>

<style>
 nav {
     border-bottom: 1px solid rgba(255,62,0,0.1);
     font-weight: 300;
 }


 .logo {
     width: 3em;
     margin: -1em 0;
 }

 .search {
     float: right;
     vertical-align: top;
     max-width: 35%;
     margin: 1em 0;
 }
 
 ul {
     display: inline-block;
     margin: 0;
     padding: 0;
 }

 /* clearfix */
 ul::after {
     content: '';
     display: block;
     clear: both;
 }

 li {
     display: block;
     float: left;
 }

 [aria-current] {
     position: relative;
     display: inline-block;
 }

 [aria-current]::after {
     position: absolute;
     content: '';
     width: calc(100% - 1em);
     height: 2px;
     background-color: rgb(255,62,0);
     display: block;
     bottom: -1px;
 }

 a {
     text-decoration: none;
     padding: 1em 0.5em;
     display: block;
 }

 @media (min-width: 400px) {
     nav {
         padding: 0 1em;
     }
 }

</style>
