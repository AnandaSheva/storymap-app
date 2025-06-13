import Map from '../utils/maps';

export async function storyMapper(story) {
  const { lat, lon } = story;

  const location = (lat != null && lon != null)
      ? {
        latitude: lat,
        longitude: lon,
        placeName: await Map.getPlaceNameByCoordinate(lat, lon),
      }
      : null;

  return {
    ...story,
    location,
  };
}