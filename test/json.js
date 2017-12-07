/**
 * Created by Administrator on 2017/5/25.
 */
var str = '{"name":"huangxiaojian","age":"23"}'
var json=JSON.parse(str);
console.log(json,typeof json);

var a = {a:1,b:2};
var stringfy=JSON.stringify(a);
console.log(stringfy,typeof stringfy);
