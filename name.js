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
// виклик запускає асинхронну функцію з таймером, яка буде виконана після зазначеного часу, ця функція буде додана до черги
manager.simulateAsyncOperation(300)
// виклик створює мікрозавдання, а мікрозавдання мають більший пріорітет і виконуються майже одразу, отже це повідомлення буде виведено найшвидше
process.nextTick(() => {
    console.log('microtask executed immediately')
})
// викликається метод scheduleImmediate який містить setImmediate, ця функція буде виконана після виконання всіх мікрозавдань, а так як мікрозавдання всього одне, то ця функція виконається другою
manager.scheduleImmediate()
// отже, поток виконання буде таким: спочатку виконається мікрозавдання process.nextTick, потім функція setImmediate, а потім setTimeout з таймером більшим за 0,
// але якшо поставити значення таймера 0, то порядок виконання макрозадач зміниться, а саме - функція process.nextTick виконається першо, за нею таймаут з нульовою затримкою, а тільки потім setImmediate

//bonus

// синхронна функція, буде виконанана найпершою
console.log('1')

// макрозавдання яке містить в собі мікрозавдання, буде додано до черги задач і виконано після мікрозавдань
setTimeout(() => {
    // макрозавдання, виконається після всіх вкладених мікрозавдань
    console.log('setTimeout1')
    // зкладені в макрозавдання мікрозавдання, будуть виконані по черзі після виконання зовнішніх мікрозавдань
    Promise.resolve().then(() => {
        console.log('promise setTimeout1')
    })
    Promise.resolve().then(() => {
        console.log('promise setTimeout2')
    })
}, 0)

// макрозавдання яке не містить в собі мікрозавдань, виконається останнім
setTimeout(() => {
    console.log('setTimeout2')
}, 0)

// перше мікрозавдання, виконається після виконання синхронного коду
Promise.resolve().then(() => {
    console.log('promise1')
})

// друге мікрозавдання, виконається після першого
Promise.resolve().then(() => {
    console.log('promise2')
})

// синхронна функція, буде виконанана після інших синхронних функцій
console.log('4')

// якщо запустити цей код разом, тобто першу і другу частину, то порядок виконання буде таким:
// спочатку виконається весь синхронний код - лог 1 і потім лог 4
// потім виконається process.nextTick
// потім виконуються мікрозадачі - проміс1 і проміс2
// потім виконується 1 макрозадача (лог setTimeout1) і вкладені в неї мікрозадачі - promise setTimeout1 і promise setTimeout2
// потім знову виконується макрозадача
// потім виконується функція setImmediate
// а потім setTimeout з затримкою (метод simulateAsyncOperation класу AsyncOperationManager), але якщо поставити затримку на 0, то цей метод виконається одразу після мікрозадач