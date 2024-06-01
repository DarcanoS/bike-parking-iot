import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RpdmVsIiwiYSI6ImNsd3ZqNng0aTByNGkycHE1bnB5MHBuOWoifQ.iNFRtyP5ULl05fp5VhMGMg';

function Map({ latitude, longitude }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 14,
    });

    // Clean up on unmount
    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div className="map-container">
      <div ref={mapContainerRef} className="map" />
      <style jsx="true">{`
        .map-container {
          position: relative;
          width: 100%;
          height: 64vh;
        }
        .map {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default Map;
