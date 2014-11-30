Swipe
=====

Compare two Mapbox maps.

http://tyanas.github.io/swipe/?lxbarth.map-x55dflb4&lxbarth.map-uuk1insw#14/40.7334/-73.9867

====

## Install

Create a file with your API keys for maps:

    cp keys{.template,}.js

Get Bing API key here http://msdn.microsoft.com/en-us/library/ff428642.aspx
and put it in keys.js

## Usage

    http://tyanas.github.io/swipe/?[map id]&[map map id]

map id is mapbox map id or other map id

## What's a Mapbox map id?

When you create a map on Mapbox.com, you will be given a map id. You can use
Swipe to compare any two Mapbox maps identified by their map ids with each
other.

https://www.mapbox.com/developers/api-overview/

## Other map providers

You can also compare maps with and among other map providers than Mapbox. Supported identifiers:

- `osm` - OpenStreetMap
- `google` - Google streets
- `google.SATELLITE` - Google satellite
- `google.HYBRID` - Google roads + satellite
- `google.TERRAIN` - Google terrain
- `bing` - Bing satellite
- `bing.Aerial` - Bing satellite, see imagerySet here http://msdn.microsoft.com/en-us/library/ff701716.aspx
- `bing.AerialWithLabels` - Bing satellite + roads (like hybrid)
- `bing.Road` - Bing roads
- `yandex` - Yandex satellite, see https://tech.yandex.ru/maps/doc/jsapi/1.x/ref/reference/maptype-docpage/
- `yandex.satellite` - Yandex satellite
- `yandex.map` - Yandex roads
- `yandex.hybrid` - Yandex satellite + roads

