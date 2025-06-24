import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapViewer = ({ mapData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-0.7, 37.6], 10);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Add sublocation data
    if (mapData && mapInstanceRef.current) {
      // Clear existing data layers but keep base tiles
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON || layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      // Remove existing legend controls
      mapInstanceRef.current.eachControl((control) => {
        if (control.getContainer && control.getContainer().className.includes('legend')) {
          mapInstanceRef.current.removeControl(control);
        }
      });

      // Color function based on accessibility category
      const getColor = (category) => {
        switch (category) {
          case 'Very Weak': return '#ff0000';    // Red
          case 'Weak': return '#ff8800';         // Orange  
          case 'Good': return '#88ccff';         // Light Blue
          case 'Very Good': return '#0066cc';   // Dark Blue
          default: return '#cccccc';            // Gray
        }
      };

      // Style function
      const style = (feature) => ({
        fillColor: getColor(feature.properties.category),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      });

      // Popup function
      const onEachFeature = (feature, layer) => {
        const props = feature.properties;
        layer.bindPopup(`
          <div>
            <h3>${props.name}</h3>
            <p><strong>Accessibility:</strong> ${props.accessibility.toFixed(3)}</p>
            <p><strong>Category:</strong> ${props.category}</p>
            <p><strong>Population:</strong> ${props.population.toLocaleString()}</p>
          </div>
        `);
      };

      // Add GeoJSON layer
      const geoJsonLayer = L.geoJSON(mapData, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(mapInstanceRef.current);

      // Add text labels to each sublocation
      geoJsonLayer.eachLayer((layer) => {
        const feature = layer.feature;
        const name = feature.properties.name;
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        
        // Create label as a tooltip that's always visible
        layer.bindTooltip(name, {
          permanent: true,
          direction: 'center',
          className: 'sublocation-label-tooltip',
          offset: [0, 0],
          opacity: 1
        }).openTooltip();
        
        // Also add a marker for better visibility
        L.marker(center, {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
              background: rgba(255,255,255,0.95); 
              color: #000; 
              border: 1px solid #333; 
              border-radius: 4px; 
              padding: 2px 5px; 
              font-size: 9px; 
              font-weight: bold; 
              text-align: center;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              white-space: nowrap;
              font-family: Arial, sans-serif;
            ">${name}</div>`,
            iconSize: [name.length * 6 + 12, 14],
            iconAnchor: [name.length * 3 + 6, 7]
          }),
          zIndexOffset: 1000
        }).addTo(mapInstanceRef.current);
      });

      // Fit map to data bounds
      mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds());

      // Add legend
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.border = '2px solid #ccc';
        div.style.borderRadius = '5px';
        
        const categories = [
          { name: 'Very Weak (0-1.0)', color: '#ff0000' },
          { name: 'Weak (1.0-1.2)', color: '#ff8800' },
          { name: 'Good (1.2-1.5)', color: '#88ccff' },
          { name: 'Very Good (1.5+)', color: '#0066cc' }
        ];

        div.innerHTML = '<h4>Water Accessibility</h4>';
        categories.forEach(cat => {
          div.innerHTML += 
            `<div><span style="background:${cat.color};width:18px;height:18px;display:inline-block;margin-right:8px;"></span>${cat.name}</div>`;
        });

        return div;
      };
      legend.addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapData]);

  if (!mapData) {
    return (
      <div className="map-placeholder">
        Loading map data... Please ensure backend is running.
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapViewer;