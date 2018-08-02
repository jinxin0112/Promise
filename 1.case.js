// promise 有兼容性问题 ie 下不行
// 可以自己根据promiseA+ 规范写一个兼容版的

// promise 三个状态  等待 pending 成功态 resolved 失败 rejected

//const Promise = require('./Promise');

let promise = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(()=>{
        resolve();
    },1000);
})

promise.then(()=>{
    console.log('success1');
},()=>{
    console.log('error1');
});

promise.then(()=>{
    console.log('success2');
},()=>{
    console.log('error2');
}).catch((err)=>{
    console.log(err);
}).then(()=>{
    console.log('success3')
    throw new Error('err');
},(err)=>{
    return new Error('err1');
});

console.log(2);