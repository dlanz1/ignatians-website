/**
 * Vite configuration file.
 *
 * This file configures Vite for a React project.
 * It uses the @vitejs/plugin-react plugin for React support.
 *
 * @module vite.config
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
