import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from '../../actions/button/button'
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from './command'

const recipes = ['Apple tart', 'Mushroom risotto', 'Tomato soup']

const CommandExample = (): React.ReactElement => (
  <CommandDialog>
    <CommandDialogTrigger render={<Button variant="outline" />}>Search recipes</CommandDialogTrigger>
    <CommandDialogPopup aria-label="Search recipes">
      <Command items={recipes}>
        <CommandInput placeholder="Search recipes" />
        <CommandPanel>
          <CommandEmpty>No recipes found.</CommandEmpty>
          <CommandList>
            {(recipe: string) => (
              <CommandItem key={recipe} value={recipe}>
                {recipe}
              </CommandItem>
            )}
          </CommandList>
        </CommandPanel>
        <CommandFooter>
          <span>Use arrow keys to navigate</span>
          <span>Enter to select</span>
        </CommandFooter>
      </Command>
    </CommandDialogPopup>
  </CommandDialog>
)

const meta = { component: CommandExample, tags: ['autodocs'], title: 'Overlays/Command' } satisfies Meta<typeof CommandExample>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Search recipes' }))
    const dialog = await within(document.body).findByRole('dialog')
    await userEvent.type(within(dialog).getByPlaceholderText('Search recipes'), 'tomato')
    await expect(within(dialog).getByText('Tomato soup')).toBeVisible()
  },
}
