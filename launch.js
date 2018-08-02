#!/usr/bin/env node
const cp = require('child_process');

const spawn = (file, tag) => {
  proc = cp.spawn('node', [file]) 
  proc.stdout.on('data', data => console.log(`[${tag}]: ${data.toString()}`))
  proc.stderr.on('data', data => console.log(`[${tag} ERROR]: ${data.toString()}`))

  proc.on('close', code => 
    console.error(`Woops! "${tag}" just exited with code ${code}`)
  )
}

spawn(require.resolve('./packages/cancha-api/index.js'), 'WEBSERVER')
