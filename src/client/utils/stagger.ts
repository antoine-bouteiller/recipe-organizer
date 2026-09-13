import { type CSSProperties } from 'react'

interface StaggerStyle extends CSSProperties {
  '--stagger': number
}

export const staggerStyle = (index: number, max: number): StaggerStyle => ({ '--stagger': Math.min(index, max) })
