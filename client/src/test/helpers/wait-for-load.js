import { waitFor, screen } from '@testing-library/react'
export const waitForLoad = () => waitFor(() => screen.findAllByRole('img'))
