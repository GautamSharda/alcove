var test = require('tape');
var system = require('./../lib/system');

// Tests for parsing the schedule string into an object.
test('schedule parsing', function(assert) {
  var schedule = '0,1,2,3,4,5,6(7)|1(5);9:15';
  var schedule2='1,3,5(4)|1(10)|6(3);23:59';
  // Number of tests for asynchronous method calls.
  assert.plan(9);
  var scheduleObj = system.parseSchedule(schedule);
  assert.equal(scheduleObj.time.minutes, 15);
  assert.equal(scheduleObj.time.hours, 9);
  assert.equal(scheduleObj.daysSets[0].number, 7);
  assert.equal(scheduleObj.daysSets[1].number, 5);
  assert.deepEqual(scheduleObj.daysSets[0].days, [0,1,2,3,4,5,6]);
  assert.deepEqual(scheduleObj.daysSets[1].days, [1]);

  var scheduleObj2 = system.parseSchedule(schedule2);
  assert.equal(scheduleObj2.daysSets.length, 3);
  assert.equal(scheduleObj2.time.minutes, 59);
  assert.equal(scheduleObj2.time.hours, 23);
});

// Testing finding the next expected backup date given date and schedule object.
test('Find next scheduled backup time', function(assert) {
  var date = new Date('2016-04-22');
  var date2 = new Date('2015-12-31');
  date2.setHours(9);
  date2.setMinutes(15);
  var schedule = '0,2(7)|1(5);9:15'
  var nextBackup = system.findNextScheduledTime(schedule, date);
  var nextBackup2 = system.findNextScheduledTime(schedule, date2);
  var dateEquals = new Date(1461507300000);
  var dateEquals2 = new Date(1451834100000);
  assert.plan(2);
  assert.equal(nextBackup.getTime(), dateEquals.getTime());
  assert.equal(nextBackup2.getTime(), dateEquals2.getTime());
});

// Testing bucket generation from a schedule object and date.
test('Bucket creation', function(assert) {
  var schedule = '0,1,2,3,4,5,6(7)|1,3,5(12);0:00';
  var schedule2 = '1,3,5(6)|5(5);3:00';
  var date = new Date(1420095600000);
  var date2 = new Date(1451815200000);

  var buckets = system.getBuckets(schedule, date);
  var buckets2 = system.getBuckets(schedule2, date2);
  assert.plan(2);
  assert.deepEqual(buckets,[ { date: new Date('Fri Dec 05 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 08 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 10 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 12 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 15 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 17 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 19 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 22 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 24 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 26 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Sat Dec 27 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Sun Dec 28 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 29 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Tue Dec 30 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 31 2014 00:00:00 GMT-0600 (CST)') },
      { date: new Date('Thu Jan 01 2015 00:00:00 GMT-0600 (CST)') } ]);
  assert.deepEqual(buckets2, [ { date: new Date('Fri Dec 04 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 11 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 18 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 21 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 23 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Dec 25 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Mon Dec 28 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Wed Dec 30 2015 03:00:00 GMT-0600 (CST)') },
      { date: new Date('Fri Jan 01 2016 03:00:00 GMT-0600 (CST)') } ]);
});

//Testing filling buckets given a directory structure and buckets.



// Identify which backups to remove given schedule and directory


