import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import supercluster from "supercluster";

const StyleMarker = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignSelf: "flex-start"
    },
    bubble: {
        flex: 0,
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: "#ffbbbb",
        padding: 4,
        borderRadius: 4,
        borderColor: "#ffbbbb",
        borderWidth: 1
    },
    count: {
        color: "#fff",
        fontSize: 13
    }
});

const ClusterMarker = ({ count }) => (
    <View style={StyleMarker.container}>
        <View style={StyleMarker.bubble}>
            <Text style={StyleMarker.count}>{count}</Text>
        </View>
    </View>
);

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
const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFill
  }
});

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
                    style={Style.map}
                    loadingIndicatorColor={"#ffbbbb"}
                    loadingBackgroundColor={"#ffbbbb"}
                    region={region}
                    onRegionChangeComplete={region => setRegion(region)}
                >
                    {cluster.markers.map((marker, index) => renderMarker(marker, index))}
                </MapView>

        );

}
