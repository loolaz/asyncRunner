# asyncRunner

async.parallelLimit implemented with Promise

## usage #1
```
const tasks = [{
    taskname: 'foo',
    param1: 'foo1',
    ...
  },
  {
    taskname: 'bar',
    param1: 'bar1',
    ...
  },...];

const runner = function(task, cb) {
  doAsyncJob(task.param1, ..., () => {
    cb();
  });
};

asyncRunner(3, tasks, runner, () => { // Run three at a time
  // done
});
```

## usage #2
```
const tasks = [{
    taskname: 'foo',
    param1: 'foo1',
    ...
  },
  {
    taskname: 'bar',
    param1: 'bar1',
    ...
  },...];
  
tasks = tasks.map((task) => {
  return function(callback) {
    doAsyncJob(task.param1, ..., () => {
      callback();
    });
  };
});

asyncRunner(3, tasks, () => { // Run three at a time
  // done
});
```
