export namespace VectorMath {
  export interface Vector2 {
    x: number
    y: number
  }

  // Distance between two points
  export const dist = (a: Vector2, b: Vector2) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Magnitude of a vector
  export const mag = (a: Vector2) => {
    return Math.sqrt(a.x * a.x + a.y * a.y)
  }

  // The normal of the vector
  export const norm = (a: Vector2) => {
    const m = mag(a)
    return {
      x: a.x / m,
      y: a.y / m
    }
  }

  // Dot product of a vector
  export const dot = (a: Vector2, b: Vector2) => {
    return a.x * b.x + a.y * b.y
  }

  // Returns the negative vector of a
  export const neg = (a: Vector2) => {
    return {
      x: -a.x,
      y: -a.y
    }
  }

  // Returns the vector subtraction of a - b
  export const sub = (a: Vector2, b: Vector2) => {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    }
  }

  // Returns the addition of vectors a and b
  export const add = (a: Vector2, b: Vector2) => {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    }
  }

  // Returns the scalar multiple of vector a times scalar s
  export const smul = (a: Vector2, s: number) => {
    return {
      x: a.x * s,
      y: a.y * s
    }
  }

  // Angle between two vectors [0, PI]
  export const angleBetween = (a: Vector2, b: Vector2) => {
    return Math.acos(dot(a, b) / (mag(a) * mag(b)))
  }

  // Projects vector a on vector b and returns the resulting vector
  export const project = (a: Vector2, b: Vector2) => {
    const angle = angleBetween(a, b)
    const projectionMag = mag(a) * Math.cos(angle)
    const bMag = mag(b)
    return {
      x: (projectionMag * b.x) / bMag,
      y: (projectionMag * b.y) / bMag
    }
  }
}
