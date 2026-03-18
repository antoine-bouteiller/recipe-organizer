import { z } from 'zod'

z.config({
  customError: (issue) => {
    switch (issue.code) {
      case 'invalid_type': {
        return `Type invalide : attendu ${issue.expected}, reçu ${String(issue.received)}`
      }
      case 'too_small': {
        if (issue.minimum === 1 && issue.origin === 'string') {
          return 'Ce champ est requis'
        }
        return issue.origin === 'string'
          ? `Doit contenir au moins ${String(issue.minimum)} caractère(s)`
          : `Doit être supérieur ou égal à ${String(issue.minimum)}`
      }
      case 'too_big': {
        return issue.origin === 'string'
          ? `Doit contenir au plus ${String(issue.maximum)} caractère(s)`
          : `Doit être inférieur ou égal à ${String(issue.maximum)}`
      }
      case 'invalid_format': {
        if (issue.format === 'email') {
          return 'Adresse email invalide'
        }
        return 'Format invalide'
      }
      case 'invalid_value': {
        return `Valeur invalide. Valeurs acceptées : ${issue.values.join(', ')}`
      }
      default: {
        return issue.message
      }
    }
  },
})
