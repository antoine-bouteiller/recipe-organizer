import {
  Command as CommandRoot,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from './primitive/command'

const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  DialogPopup: CommandDialogPopup,
  DialogTrigger: CommandDialogTrigger,
  Empty: CommandEmpty,
  Footer: CommandFooter,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Panel: CommandPanel,
})

export { Command }
