# Beetle: A beeautiful web interface for Beets

Beetle is a web interface for a music library in [Beets](https://github.com/beetbox/beets) build using [sapper](https://sapper.svelte.dev/).

![video](https://book.buron.coffee/notes/img/beetle-demo.mp4)

## Installation

```
git clone https://gitlab.com/maxburon/beetle.git
cd beetle
npm install
```

## Configuration

Change your beets configuration, for at least, enabling the plugin `web` with cors parameters (allowing the interface to access the API):
```
plugins: web
web:
        host: 0.0.0.0
        cors: 'http://localhost:3000'
```

It is better to fetch lyrics and cover, also it is also recommended to convert the music into [well supporting format for the web](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs) using e.g. the following plugins configuration:

```
plugins: web fetchart lyrics convert

fetchart:
        auto: yes
        maxwidth: 720

convert:
        auto: yes
        format: mp3
        no_convert: format:FLAC
        never_convert_lossy_files: no
        format: mp3
```

Also copy the content of ~.env.source~ into ~.env~ and edit it, if you need.

```
cp .env.source .env
```

## Running

Run the web API of beets:
```
beet web
```
Into another terminal, go the cloned directory of beetle and run:
```
npm run dev
# or for production
npm run build
npm run start
```
and visit <http://localhost:3000>
