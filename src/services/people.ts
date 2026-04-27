export interface Person {
  id: number
  name: string
  ageInHours: number
}

// Simulated async data source — replace with real fetch calls
const PEOPLE: Person[] = [
  { id: 1, name: 'Alice', ageInHours: 262800 },
  { id: 2, name: 'Bob', ageInHours: 350400 },
  { id: 3, name: 'Charlie', ageInHours: 219000 },
]

// Simulated API client — replace with real API calls
export const peopleApi = {
  getAll(): Promise<Person[]> {
    // return fetch('/api/people').then(r => r.json())
    return new Promise((resolve) => setTimeout(() => resolve(PEOPLE), 300))
  },

  getById(id: number): Promise<Person | undefined> {
    // return fetch(`/api/people/${id}`).then(r => r.json())
    return new Promise((resolve) =>
      setTimeout(() => resolve(PEOPLE.find((p) => p.id === id)), 300),
    )
  },

  updateAge(id: number, ageInHours: number): Promise<void> {
    // return fetch(`/api/people/${id}`, { method: 'PATCH', body: JSON.stringify({ ageInHours }) })
    const person = PEOPLE.find((p) => p.id === id)
    if (person) person.ageInHours = ageInHours
    return Promise.resolve()
  },
}
