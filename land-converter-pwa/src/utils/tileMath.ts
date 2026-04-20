/**
 * Utility for OpenStreetMap/ESRI tile calculations (Slippy Map Tiles)
 */

export interface TileXYZ {
  x: number;
  y: number;
  z: number;
}

export function latLngToTile(lat: number, lng: number, zoom: number): TileXYZ {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y, z: zoom };
}

export function getTileUrl(tile: TileXYZ, type: 'satellite' | 'street' | 'topo'): string {
  if (type === 'satellite') {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;
  }
  if (type === 'topo') {
    const s = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
    return `https://${s}.tile.opentopomap.org/${tile.z}/${tile.x}/${tile.y}.png`;
  }
  // For OSM, we use a random sub-domain a, b, or c
  const s = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
  return `https://${s}.tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`;
}

export function getTilesInRadius(center: {lat: number, lng: number}, radiusKm: number, zoom: number): TileXYZ[] {
  // Rough approximation: 1 degree lat is ~111km
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(center.lat * Math.PI / 180));

  const topLeft = latLngToTile(center.lat + latDelta, center.lng - lngDelta, zoom);
  const bottomRight = latLngToTile(center.lat - latDelta, center.lng + lngDelta, zoom);

  const tiles: TileXYZ[] = [];
  // Use a safety limit to prevent accidental explosion of tiles (max 100 tiles per zoom level)
  let count = 0;
  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      tiles.push({ x, y, z: zoom });
      count++;
      if (count > 200) break; 
    }
    if (count > 200) break;
  }
  return tiles;
}
