import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
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

import { container } from './command.stories.css'

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

const meta = { component: CommandExample, title: 'Overlays/Command' } satisfies Meta<typeof CommandExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchSection = canvas.getByRole('region', { name: 'Search' })
    await userEvent.click(within(searchSection).getByRole('button', { name: 'Search recipes' }))
    const dialog = await within(document.body).findByRole('dialog', { name: 'Search recipes' })
    await userEvent.type(within(dialog).getByPlaceholderText('Search recipes'), 'tomato')
    await expect(within(dialog).getByText('Tomato soup')).toBeVisible()
    await userEvent.keyboard('{Escape}')
  },
  render: () => (
    <div className={container}>
      <StorySection title="Default">
        <CommandExample />
      </StorySection>
    </div>
  ),
}
