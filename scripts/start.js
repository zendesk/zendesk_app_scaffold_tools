/**
 * Exectutor for "zendesk-app-scripts start" command
 * Resolve with logs after "zat server" is terminated
 */

'use strict'

const spawn = require('cross-spawn')
const chalk = require('chalk')

module.exports = (flags = {}, resolve, reject) => {
  const path = flags.p || flags.path || './dist'
  const result = spawn('zat', ['server', '-p', path], { stdio: 'inherit' })
  const result2 = spawn('webpack', ['--watch', path], { stdio: 'inherit' })

  // i'm confused what/why is trying to be done here?
  // We start zat server. And then when you ctrl-c that
  // we run zat package. Why?
  // const result2 = spawn.sync('zat', ['package'], { stdio: 'inherit' })
  // const result2 = spawn.sync('npm', ['run watch', path], { stdio: 'inherit' })
  console.log(result, result2)

  resolve(`${chalk.green('log:')} ZAT server Shuts down with exit code ${result.status}`)
}
