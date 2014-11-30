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

// set up defaults
var leftLayer = 'osm.mapnik',
    rightLayer = 'bing.Aerial',
    osmTypes = {
        mapnik: L.OSM.Mapnik,
        cycle: L.OSM.CycleMap,
        transport: L.OSM.TransportMap,
        mapquest: L.OSM.MapQuestOpen,
        hot: L.OSM.HOT
    };

(function() {
    function getLayerIds() {
        var defaultLayers = [leftLayer, rightLayer],
            searchStr,
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
    var layerids = getLayerIds();
    var createLayer = function(layerid) {
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
    };
    var map = L.mapbox.map('map', null, {
        center: [0, 0],
        zoom: 3
    });
    var hash = L.hash(map);
 
    var left = createLayer(layerids[0]).addTo(map);
    var right = createLayer(layerids[1]).addTo(map);

    // Remove classes Google.js adds.
    left.getContainer().className =
        left.getContainer().className.replace(/\bleaflet-top\b/,'').replace(/\bleaflet-left\b/,'');
    right.getContainer().className =
        right.getContainer().className.replace(/\bleaflet-top\b/,'').replace(/\bleaflet-left\b/,'');

    // Clip as you move map or range slider.
    var range = document.getElementById('range');
    function clip() {
        var nw = map.containerPointToLayerPoint([0, 0]),
            se = map.containerPointToLayerPoint(map.getSize()),
            clipX = nw.x + (se.x - nw.x) * range.value;
        left.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
        right.getContainer().style.clip = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
    }
    clip();
    range['oninput' in range ? 'oninput' : 'onchange'] = clip;
    map.on('move', clip);
})();
