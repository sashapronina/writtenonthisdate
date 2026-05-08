import poemsData from '../data/poems.json'
import { toDayKey } from './date'

export type Poem = {
  id: string
  title: string
  author: string
  body: string
  month: number
  day: number
  year?: number
  source?: string
}

export function getAllPoems(): Poem[] {
  return poemsData as Poem[]
}

export function buildPoemsByDayKey(poems: Poem[]): Map<string, Poem[]> {
  const byDayKey = new Map<string, Poem[]>()

  for (const poem of poems) {
    const key = toDayKey(poem.month, poem.day)
    const existing = byDayKey.get(key)

    if (existing) {
      existing.push(poem)
      continue
    }

    byDayKey.set(key, [poem])
  }

  return byDayKey
}
