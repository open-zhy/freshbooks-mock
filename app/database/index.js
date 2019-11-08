const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// const fs = require('fs');
// const path = require('path');

const adapter = new FileSync('app/database/db.json');
const db = low(adapter);
const cloneDeep = require('lodash.clonedeep');

const initialDatas = {
  clients: [],
  invoices: [],
  payments: [],
  seq: {
    clients: 0,
    invoices: 0,
    payments: 0,
  },
};

/**
 * Get the next id of a given model
 * This also update the db entry of that value
 * to n+1 so that calling this function next time will
 * return an incremented value
 *
 * @param {*} model
 * @returns {integer} The next sequence id
 */
function nextSeq(model) {
  const seqPath = `seq[${model}]`;
  const seqEntry = db.get(seqPath, null);

  if (!seqEntry) {
    throw new Error(`Sequence [${model}] does not exist`);
  }

  const nextSeqVal = seqEntry.value();
  // update the sequence
  db.update(seqPath, (n) => n + 1).write();

  return nextSeqVal;
}


function init(dbInstance) {
  dbInstance.defaults(cloneDeep(initialDatas)).write();
}

function flush(dbInstance) {
  // fs.writeFileSync(path.join(__dirname, 'db.json'), '');
  dbInstance.setState(cloneDeep(initialDatas)).write();
}

module.exports = {
  instance: db,
  nextSeq,
  init,
  flush,
};
