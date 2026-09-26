import { describe, expect, it } from 'vite-plus/test'

import { parseBoldText } from './bold-text'

describe('parseBoldText', () => {
  it('bolds a delimited word inside plain text', () => {
    expect(parseBoldText('Mélanger **vivement**.')).toEqual([
      { bold: false, text: 'Mélanger ' },
      { bold: true, text: 'vivement' },
      { bold: false, text: '.' },
    ])
  })

  it('bolds a leading word', () => {
    expect(parseBoldText('**Four** chaud')).toEqual([
      { bold: true, text: 'Four' },
      { bold: false, text: ' chaud' },
    ])
  })

  it('keeps an unmatched delimiter literal', () => {
    expect(parseBoldText('a ** b')).toEqual([{ bold: false, text: 'a ** b' }])
    expect(parseBoldText('**a** b ** c')).toEqual([
      { bold: true, text: 'a' },
      { bold: false, text: ' b ** c' },
    ])
  })

  it('keeps line breaks in one plain segment', () => {
    expect(parseBoldText('ligne 1\nligne 2')).toEqual([{ bold: false, text: 'ligne 1\nligne 2' }])
  })

  it('yields nothing for an empty bold pair', () => {
    expect(parseBoldText('****')).toEqual([])
  })

  it('keeps HTML as plain text', () => {
    expect(parseBoldText('<b>chaud</b>')).toEqual([{ bold: false, text: '<b>chaud</b>' }])
  })
})
