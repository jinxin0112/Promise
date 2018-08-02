function resolvePromise(promise2, x, resolve, reject) {
    let called = false;
    if (promise2 === x) {
        reject(new TypeError('x can not be promise2'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true;
                    resolvePromise(promise2, y, resolve, reject) // 递归直到解析为普通值为止
                }, err => {
                    if (called) return
                    called = true;
                    reject(err)
                });
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class Promise {
    constructor(executor) {

        this.value = undefined; // 成功原因
        this.reason = undefined; // 失败原因
        this.status = 'pending'; // 状态
        this.onResolvedCallbacks = []; // 存放成功回调
        this.onRejectedCallbacks = []; // 存放失败回调

        let resolve = value => {
            if (this.status === 'pending') {
                this.value = value;
                this.status = 'resolved';
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        let reject = reason => {
            if (this.status === 'pending') {
                this.reason = reason;
                this.status = 'rejected';
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }

    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : e => e
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === 'resolved') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            }
            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }


}


Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    })
}
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = [];
        let i = 0;
        function processData(index, data) {
            arr[index] = data;
            if (++i == promises.length) {
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(data => { // data是成功的结果
                processData(i, data);
            }, reject);
        }
    })
}
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject);
        }
    })
}

module.exports = Promise