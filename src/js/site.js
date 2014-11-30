L.Google.prototype.addTo =
L.Yandex.prototype.addTo =
function(map) {
    map.addLayer(this);
    return this;
};
L.Yandex.prototype.getContainer =
L.Google.prototype.getContainer = function() {
    return this._container;
};

(function() {

    // set up defaults
    var osmTypes = {
            mapnik: L.OSM.Mapnik,
            cycle: L.OSM.CycleMap,
            transport: L.OSM.TransportMap,
            mapquest: L.OSM.MapQuestOpen,
            hot: L.OSM.HOT
        },
        layerTypes = {
            'osm.mapnik': 'OSM Mapnik',
            'osm.cycle': 'OSM CycleMap',
            'osm.transport': 'OSM TransportMap',
            'osm.mapquest': 'OSM MapQuest',
            'osm.hot': 'OSM Humanitarian',
            'bing.Road': 'Bing Streets',
            'bing.Aerial': 'Bing Aerial',
            'bing.AerialWithLabels': 'Bing Hybrid',
            'google.ROADMAP': 'Google Streets',
            'google.SATELLITE': 'Google Satellite',
            'google.TERRAIN': 'Google Terrain',
            'google.HYBRID': 'Google Hybrid',
            'yandex.map': 'Yandex Streets',
            'yandex.satellite': 'Yandex Satellite',
            'yandex.hybrid': 'Yandex Hybrid',
        },
        defaultLayers = ['osm.mapnik', 'bing.Aerial'],
        readyLayers = {},
        map = L.mapbox.map('map', null, {
            center: [0, 0],
            zoom: 3
        }),
        hash = L.hash(map),
        range = document.getElementById('range'),
        leftTypeSel = document.getElementById('leftType'),
        //rightTypeSel = document.getElementById('rightType'),
        left,
        right,
        layerIds,
        leftLayer,
        rightLayer;

    if(_.isUndefined(BingAPIKey)) {
        // for *.github.io
        // use this one https://github.com/lxbarth/swipe/blob/gh-pages/site.js#L20
        BingAPIKey = 'AjCTNNlzpfcDOc0G58A4Hzx1N0OGrO8IXpFj1TVqlPG7sUxc8LqXbClnVK9RLk4q';
    }

    function getLayerIds() {
        var searchStr,
            layers;

        if (_.isUndefined(document.location.search)) {
            return defaultLayers;
        }

        searchStr = document.location.search.split('?')[1];
        if (_.isUndefined(searchStr)) {
            return defaultLayers;
        }

        layers = searchStr
            .split('/')[0]
            .split('&');
        if (layers.length < 2) {
            return defaultLayers;
        }
        return layers;
    }

    function createLayer(layerid) {
        var split = layerid.split('.');
        switch(split[0]) {
            case 'bing':
                return new L.BingLayer(BingAPIKey, {type: split[1] || 'Aerial'});
            case 'google':
                return new L.Google(split[1] || 'ROADMAP');
            case 'yandex':
                return new L.Yandex(split[1] || 'satellite');
            case 'osm':
                return new osmTypes[split[1] || 'mapnik']();
            default:
                return L.mapbox.tileLayer(layerid);
        }
    }

    function updateLayer(layerId) {
        var l = readyLayers[layerId],
            lClasses;
        if (_.isUndefined(l)) {
            l = createLayer(layerId).addTo(map);
            lClasses = l.getContainer().classList;
            lClasses.add(layerId);

            // Remove classes Google.js adds.
            if (layerId.search('google') === 0) {
                lClasses.remove('leaflet-top');
                lClasses.remove('leaflet-left');
            }

            // cache layers
            readyLayers[layerId] = l;
        }

        return l;
    }

    function clip() {
        // Clip as you move map or range slider.
        var nw = map.containerPointToLayerPoint([0, 0]),
            se = map.containerPointToLayerPoint(map.getSize()),
            clipX = nw.x + (se.x - nw.x) * range.value;
        left.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
        right.getContainer().style.clip = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
    }

    function onRangeChange(){
        var off = (1 + (1 - range.value) * 100) + '%';
        leftTypeSel.style.right = off;
        //rightTypeSel.style.right = off;
        clip();
    }

    function onLayerTypeChange() {
        // select layer type dynamically
        left.getContainer().style.display = 'none';
        left = updateLayer(leftTypeSel.value);
        left.getContainer().style.display = 'block';
        clip();
    }

    function getOptions() {
        // each layerTypes
    }

    layerIds = getLayerIds();
    left = updateLayer(layerIds[0]);
    right = updateLayer(layerIds[1]);

    leftTypeSel.value = layerIds[0];

    range['oninput' in range ? 'oninput' : 'onchange'] = onRangeChange;
    leftTypeSel['onchange'] = onLayerTypeChange;
    map.on('move', clip);

    clip();
})();
