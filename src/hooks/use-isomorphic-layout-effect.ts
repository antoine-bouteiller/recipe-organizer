'use client'

import { createIsomorphicFn } from '@tanstack/react-start'
import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicLayoutEffect = createIsomorphicFn().server(useEffect).client(useLayoutEffect)
