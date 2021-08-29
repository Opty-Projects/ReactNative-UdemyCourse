export interface PlacePayload {
  title: string
  thumbnailUri: string
  address: string
  latitude: number
  longitude: number
}

export default interface Place extends PlacePayload {
  id: string
}
