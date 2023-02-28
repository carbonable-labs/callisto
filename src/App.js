import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFsN2hhemFyIiwiYSI6ImNsZW8xZzhjejBjc2czd3BhcWFkdm81a2IifQ.5LRKXungN72fuodnrz8lbg';

export default function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  // const [lng] = useState(-82.24449832213654);
  // const [lat] = useState(9.346143929970808);
  const [view, setView] = useState(true);
  const [lng] = useState(-83.544445);
  const [lat] = useState(8.68655);
  const [zoom] = useState(17.5);

  const coordinates = [
    [
      -83.54594972360404,
      8.68624981393009
    ],
    [
      -83.5454766360034,
      8.686012085995856
    ],
    [
      -83.54510605071688,
      8.686023777537628
    ],
    [
      -83.54464873270258,
      8.686121207034162
    ],
    [
      -83.54352514965186,
      8.68534956473006
    ],
    [
      -83.54331226023137,
      8.685411919722583
    ],
    [
      -83.54333197221479,
      8.685634059299659
    ],
    [
      -83.54297321411818,
      8.685805535373817
    ],
    [
      -83.54303629246486,
      8.686160178825688
    ],
    [
      -83.54251195370746,
      8.68632775748236
    ],
    [
      -83.54219656197412,
      8.686222533683434
    ],
    [
      -83.54218079238716,
      8.686920127948511
    ],
    [
      -83.5425158961039,
      8.687076014756997
    ],
    [
      -83.54322158510843,
      8.68769566418382
    ],
    [
      -83.54397458287202,
      8.687633309571027
    ],
    [
      -83.54458565435593,
      8.687181238317635
    ],
    [
      -83.54529528575688,
      8.686885053407153
    ],
    [
      -83.54594972360404,
      8.68624981393009
    ]
  ];
  const longitudes = coordinates.map(point => point[0]);
  const latitudes = coordinates.map(point => point[1]);
  const maxLon = Math.max(...longitudes);
  const minLon = Math.min(...longitudes);
  const maxLat = Math.max(...latitudes);
  const minLat = Math.min(...latitudes);

  const handleClick = (event) => {
    event.preventDefault();
    map.current.setLayoutProperty('layer-layer', 'visibility', view ? 'none' : 'visible');
    setView(!view);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const mapbox = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      maxZoom: 20,
      minZoom: 10,
      zoom: zoom,
    });

    mapbox.on('load', () => {

      // Add a data source containing one point feature.
      mapbox.addSource('ndvi', {
        type: 'geojson',
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [coordinates],
              }
            }
          ]
        }
      });

      mapbox.addSource('layer', {
        'type': 'image',
        'url': 'https://i.ibb.co/7bFkb4g/banegas-farm-ndvi-20230214.png',
        'coordinates': [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
        ]
      });

      mapbox.addLayer({
        id: 'layer-layer',
        type: 'raster',
        source: 'layer',
        layout: { visibility: 'visible' },
        paint: {
          'raster-fade-duration': 0
        }
      });


      mapbox.addLayer({
        id: 'outline',
        type: 'line',
        source: 'ndvi',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 6
        }
      });

    });

    map.current = mapbox;
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" onClick={handleClick}/>
    </div>
  );
}