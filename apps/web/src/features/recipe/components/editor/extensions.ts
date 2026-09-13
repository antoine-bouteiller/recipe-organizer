import { type Klass, type LexicalNode } from 'lexical'

import { MagimixProgramNode } from './magimix/magimix-program-node'
import { SubrecipeNode } from './subrecipe/subrecipe-node'

export const recipeNodes: readonly Klass<LexicalNode>[] = [MagimixProgramNode, SubrecipeNode]
