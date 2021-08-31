export default interface Product {
  id: string
  ownerId: string
  ownerPushToken?: string
  description: string
  imageUri: string
  price: number
  title: string
}
