module.exports = (...objs) => [...new Set(objs.reduce((keys, obj) => keys.concat(Object.keys(obj)), []))]
