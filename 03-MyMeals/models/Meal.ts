export default interface Meal {
  id: string
  categoryIds: string[]
  affordability: string
  complexity: string
  duration: number
  imageUri: string
  ingredients: string[]
  isGlutenFree: boolean
  isLactoseFree: boolean
  isVegan: boolean
  isVegetarian: boolean
  steps: string[]
  title: string
}
