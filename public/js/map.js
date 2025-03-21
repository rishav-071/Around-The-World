const olaMaps = new OlaMaps({
    apiKey: mapApiKey,
});

let olaMap = olaMaps.init({
    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
    container: "map",
    center: [lng, lat],
    zoom: 15,
});

const popup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' }).setHTML(`<h4>${loc}, ${country}</h4><p>Exact location will be provided after booking.</p>`);

olaMaps
    .addMarker({ offset: [0, 0], anchor: "bottom", color: "red" })
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(olaMap);
