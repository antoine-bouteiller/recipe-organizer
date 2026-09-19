import { Button } from '@recipe-organizer/design-system/button'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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

import * as styles from './command.stories.css'

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
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <CommandExample />
      </StorySection>
    </div>
  ),
}

export const SearchAndDismiss: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Search recipes' }))
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Search recipes' })
    await userEvent.type(within(dialog).getByPlaceholderText('Search recipes'), 'tomato')
    await expect(within(dialog).getByText('Tomato soup')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
  tags: ['!dev'],
}
