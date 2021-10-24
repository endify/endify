#!/usr/bin/env node
import {setup} from '../setup'

setup().catch(error => {
  console.error(error)
  process.exit(1)
})
