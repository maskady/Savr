import React, { useState, useEffect } from 'react';
import { Text, View, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import MapView, { Marker } from 'react-native-maps';

import supercluster from "supercluster";

const ClusterMarker = ({ count }) => {
    const [styles, setStyles] = useState(getStyles());
    useEffect(() => {
      const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
      return () => sub.remove();
    }, []);
    
    return (
        <View style={styles.mapDemo.markerContainer}>
            <View style={styles.mapDemo.markerBubble}>
                <Text style={styles.mapDemo.markerCount}>{count}</Text>
            </View>
        </View>
    );
};

function getZoomLevel(longitudeDelta) {
    const angle = longitudeDelta;
    return Math.round(Math.log(360 / angle) / Math.LN2);
}

export function getCluster(places, region) {
    const cluster = new supercluster({
        radius: 40,
        maxZoom: 16
    });

    let markers = [];

    try {
        const padding = 0;

        cluster.load(places);

        markers = cluster.getClusters(
            [
                region.longitude - region.longitudeDelta * (0.5 + padding),
                region.latitude - region.latitudeDelta * (0.5 + padding),
                region.longitude + region.longitudeDelta * (0.5 + padding),
                region.latitude + region.latitudeDelta * (0.5 + padding)
            ],
            getZoomLevel(region.longitudeDelta)
        );
    } catch (e) {
        console.debug("failed to create cluster", e);
    }

    return {
        markers,
        cluster
    };
}

const INITIAL_POSITION = {
  latitude: 41.924447,
  longitude: -87.687339,
  latitudeDelta: 1,
  longitudeDelta: 1
}

const COORDS = [
  { lat: 42, lon: -87 },
  { lat: 42.1, lon: -87 },
  { lat: 42.2, lon: -87 },
  { lat: 42.3, lon: -87 },
  { lat: 42.4, lon: -87 }
];

export default function MapDemo (){
    const styles = getStyles();
    const [region, setRegion] = useState(INITIAL_POSITION);

    const renderMarker = (marker, index) => {
        const key = index + marker.geometry.coordinates[0];

        // If a cluster
        if (marker.properties) {
            return (
                <Marker
                    key={key}
                    coordinate={{
                        latitude: marker.geometry.coordinates[1],
                        longitude: marker.geometry.coordinates[0]
                    }}
                >
                    <ClusterMarker count={marker.properties.point_count} />
                </Marker>
            );
        }
        // If a single marker
        return (
            <Marker
                key={key}
                coordinate={{
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0]
                }}
            />
        );
    };

    const allCoords = COORDS.map(c => ({
        geometry: {
            coordinates: [c.lon, c.lat]
        }
    }));

    const cluster = getCluster(allCoords, region);

    return (
        <MapView
            style={styles.mapDemo.map}
            loadingIndicatorColor={"#ffbbbb"}
            loadingBackgroundColor={"#ffbbbb"}
            region={region}
            onRegionChangeComplete={region => setRegion(region)}
        >
            {cluster.markers.map((marker, index) => renderMarker(marker, index))}
        </MapView>
    );
}
