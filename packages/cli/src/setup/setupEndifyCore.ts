import {EndifyCore} from '@endify/core'

export async function setupEndifyCore() {
  return new EndifyCore(/*{
    cwd: process.cwd(),
  }*/)
}
