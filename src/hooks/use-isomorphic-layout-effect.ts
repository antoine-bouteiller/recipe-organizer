import { createIsomorphicFn } from '@tanstack/solid-start'
import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicLayoutEffect = createIsomorphicFn().server(useEffect).client(useLayoutEffect)
