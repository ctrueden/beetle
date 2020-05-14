<script>
 export let item
 export let itemLink = "/item/" + item.id
 export let artistLink = "/artist/" + item.mb_artistid

 const getMinute = function(seconds) {
     return Math.floor(seconds/60) 
 }

 const getSecond = function(sec) {
     let seconds = Math.round(sec - 60 * getMinute(sec))

     return (seconds < 10) ? "0"+seconds : seconds
 }
</script>


<div class="item">
    <div class="name">
        <div class="title">
            <a href="{itemLink}">{item.title}</a>
        </div>
        <div class="artist">
            <a href="{artistLink}">{item.artist}</a>
        </div>
    </div>
    <div class="duration">
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

 .item .title {
     font-weight: bold;
 }

 .item .artist {
     font-size: .8em;
     
 }
</style>
