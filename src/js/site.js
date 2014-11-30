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
var leftLayerId = 'osm.mapnik',
    rightLayerId = 'bing.Aerial',
    osmTypes = {
        mapnik: L.OSM.Mapnik,
        cycle: L.OSM.CycleMap,
        transport: L.OSM.TransportMap,
        mapquest: L.OSM.MapQuestOpen,
        hot: L.OSM.HOT
    },
    readyLayers = {},
    leftLayer,
    rightLayer;

(function() {
    function getLayerIds() {
        var defaultLayers = [leftLayerId, rightLayerId],
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
    var hash = L.hash(map),
        left,
        right;

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
                //l.getContainer().className = l.getContainer().className
                //    .replace(/\bleaflet-top\b/,'')
                //    .replace(/\bleaflet-left\b/,'');
            }

            // cache layers
            readyLayers[layerId] = l;
        }

        return l;
    }

    left = updateLayer(layerids[0]);
    right = updateLayer(layerids[1]);

    // Remove classes Google.js adds.
    //left.getContainer().className =
    //    left.getContainer().className.replace(/\bleaflet-top\b/,'').replace(/\bleaflet-left\b/,'');
    //right.getContainer().className =
    //    right.getContainer().className.replace(/\bleaflet-top\b/,'').replace(/\bleaflet-left\b/,'');

    // Clip as you move map or range slider.
    var range = document.getElementById('range'),
        leftTypeSel = document.getElementById('leftType');

    function clip() {
        var nw = map.containerPointToLayerPoint([0, 0]),
            se = map.containerPointToLayerPoint(map.getSize()),
            clipX = nw.x + (se.x - nw.x) * range.value;
        left.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
        right.getContainer().style.clip = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
    }
    function onRangeChange(){
        leftTypeSel.style.right = (1 + (1 - range.value) * 100) + '%';
        clip();
    }

    leftTypeSel.value = layerids[0];

    range['oninput' in range ? 'oninput' : 'onchange'] = onRangeChange;
    clip();
    map.on('move', clip);

    // select layer type dynamically
    function onLayerTypeChange() {
        //left.getContainer().remove(); // destroy event listeners?
        //left.getContainer().style.clip = 'rect(0,0,0,0)';
        left.getContainer().style.display = 'none';
        left = updateLayer(leftTypeSel.value);
        left.getContainer().style.display = 'block';
        clip();
    }
    leftTypeSel['onchange'] = onLayerTypeChange;
})();
