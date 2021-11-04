#!/usr/bin/env node

process.argv
  .slice(2)
  .map(pair => pair.split('='))
  .forEach(([key, value]) => {
    process.env[key] = value;
  });

require('../backend/dist');
