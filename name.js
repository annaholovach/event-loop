class AsyncOperationManager {
    simulateAsyncOperation(delay) {
        setTimeout(() => {
            console.log(`operation completed after ${delay}`)
        }, delay)
    }

    scheduleImmediate() {
        setImmediate(() => {
            console.log(`immediate task executed`)
        })
    }
}

const manager = new AsyncOperationManager()
// This call invokes an asynchronous function with a timer that will be executed after the specified time, and this function is added to the queue.
manager.simulateAsyncOperation(300)
// This call creates a microtask, and microtasks have higher priority and execute almost immediately, so this message will be printed first.
process.nextTick(() => {
    console.log('microtask executed immediately')
})
// The scheduleImmediate method containing setImmediate is called, and this function will be executed after all microtasks. Since there is only one microtask, this function will be executed second.
manager.scheduleImmediate()
// Therefore, the execution flow will be as follows: first process.nextTick executes, then the setImmediate function, and finally, setTimeout with a delay greater than 0. However, if you set the timer value to 0, the order of execution of macro tasks will change, specifically, the process.nextTick function will execute first, followed by the zero-delay setTimeout, and only then setImmediate.

// Bonus

// Synchronous function, will be executed first.
console.log('1')

// A macro task containing microtasks is added to the task queue and will be executed after the microtasks.
setTimeout(() => {
    // A macro task that will execute after all the nested microtasks.
    console.log('setTimeout1')
    // Microtasks nested within the macro task will be executed sequentially after the outer microtasks.
    Promise.resolve().then(() => {
        console.log('promise setTimeout1')
    })
    Promise.resolve().then(() => {
        console.log('promise setTimeout2')
    })
}, 0)

// A macro task that does not contain microtasks will be executed last.
setTimeout(() => {
    console.log('setTimeout2')
}, 0)

// The first microtask, which will execute after the synchronous code.
Promise.resolve().then(() => {
    console.log('promise1')
})

// The second microtask, which will execute after the first one.
Promise.resolve().then(() => {
    console.log('promise2')
})

// Synchronous function, will be executed after other synchronous functions.
console.log('4')

// When you run this code together, the execution order will be as follows:
// First, all synchronous code is executed - log 1 and then log 4.
// Then process.nextTick is executed.
// Then microtasks are executed - promise1 and promise2.
// Then one macro task is executed (log setTimeout1) and its nested microtasks - promise setTimeout1 and promise setTimeout2.
// Then another macro task is executed.
// Then the setImmediate function is executed.
// Finally, setTimeout with a delay (the simulateAsyncOperation method of the AsyncOperationManager class) will execute, but if you set the delay to 0, this method will execute immediately after the microtasks.
