#### 字符串拼接1000次
```
1. 添加到数组中
var str='abc';
var arr=[];
var start=new Date().getTime();
for (var i=0;i<1000;i++) {
    arr.push(str);
}
str=arr.join('');
console.log(new Date().getTime()-start);

2. 运用递归
var str='abc';
var newStr='';
var start=new Date().getTime();
function recursion(num) {
    newStr+=str;
    num++;
    if (num>=1000) {
        console.log(new Date().getTime()-start);
        return newStr;  
    } else{
        recursion(num);
    }
}
recursion(0);
```
####  数组去重