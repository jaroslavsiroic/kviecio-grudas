onRecordAfterCreateSuccess((e) => {
  const newsletter = require(`${__hooks}/newsletter.js`);
  newsletter.subscribe(e.record);

  e.next();
}, "users");
