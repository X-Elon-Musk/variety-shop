/**
 * Created by Administrator on 2017/6/2.
 */
var man={
    'name':'li',
    'age':'26'
}
for(var i in man) {//不使用过滤
    console.log(i,":",man[i]);
}